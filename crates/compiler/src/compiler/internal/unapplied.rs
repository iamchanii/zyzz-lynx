//! Proves which exports of a complete graph no module reads in a way that needs their runtime
//! value, so a style definition's rules or a configuration's selector can be left out.
//!
//! The proof reads bindings, not identifier text. Every value reference of an exported binding,
//! in its own module and through each import of it, must be one the rewritten module no longer
//! makes: an application whose class list a composition replaces for a style definition, and a
//! selection folded to constant props or a token read for a variable selector. A member of an
//! exported namespace, and the `vars` selector of an exported configuration, qualify the same way
//! through reads of the namespace or configuration. Any other read, re-export, default or dynamic
//! import, or `require` call keeps the export, as does a module that no graph module imports.

use std::sync::Arc;

use oxc_ast::AstKind;
use oxc_ast::ast::{
    Argument, BindingPattern, Declaration, Expression, ImportDeclarationSpecifier,
    ImportOrExportKind, PropertyKey, Statement, TSModuleReference, TSNamespaceDeclarationBody,
    VariableDeclarationKind,
};
use oxc_semantic::Semantic;
use oxc_span::{GetSpan, Span};
use oxc_syntax::node::NodeId;
use oxc_syntax::symbol::SymbolId;
use rustc_hash::{FxHashMap, FxHashSet};

use crate::compiler::internal::syntax::Parsed;

/// Exports left without their runtime value, by module identity.
pub type Exports = FxHashMap<Arc<str>, Unused>;

/// The exports of one module that no module of the graph reads at runtime.
#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub struct Unused {
    /// Names of the style definitions left without rules.
    pub definitions: FxHashSet<Arc<str>>,
    /// Scope keys of the variable configurations left without their runtime selector.
    pub selectors: FxHashSet<Arc<str>>,
}

/// One parsed module of the graph.
pub struct Module<'m, 'a> {
    /// Names of the module's plain style definitions, which hold no composition, by call start.
    pub definitions: FxHashMap<u32, &'m Arc<str>>,
    /// Starts of scope selections folded to constant props.
    pub folded: &'m FxHashSet<u32>,
    /// Stable module identity.
    pub id: &'m Arc<str>,
    /// The parsed module.
    pub parsed: &'m Parsed<'a>,
    /// Starts of applications whose class lists compositions replace.
    pub replaced: &'m FxHashSet<u32>,
    /// Scope keys of the module's variable configurations, by call start.
    pub selectors: FxHashMap<u32, &'m Arc<str>>,
}

/// What an export path holds.
#[derive(Clone, Copy)]
enum Kind {
    /// A style definition, read only by replaced applications.
    Definition,
    /// A variable selector, read only by folded selections and token reads.
    Selector,
}

/// An export the graph may leave without its runtime value.
struct Candidate {
    kind: Kind,
    /// The definition name or configuration scope key.
    name: Arc<str>,
}

/// Candidates by export path, such as `field`, `styles.field` for a namespace member, or
/// `config.vars` for the selector of a whole exported configuration.
type Candidates = FxHashMap<String, Candidate>;

/// What a binding holds.
#[derive(Clone, Copy)]
enum Binding {
    /// A namespace, configuration, or module object whose members hold the exports.
    Container,
    /// One export.
    Leaf(Kind),
}

/// How a binding reference reads an export.
enum Read<'a> {
    /// A read the rewritten module no longer makes.
    Consumed,
    /// A read that may reach the export's runtime value.
    Escaped,
    /// A static member read of a container, with the member expression's node.
    Member(&'a str, NodeId),
}

/// Exports that no module reads at runtime, by module identity. `resolve` maps a specifier of a
/// module to the identity of a graph module, and returns `Err(())` when it cannot tell, which
/// proves nothing.
pub fn collect(
    modules: &[Module<'_, '_>],
    resolve: impl Fn(&str, &str, Span) -> Result<Option<Arc<str>>, ()>,
) -> Exports {
    let mut candidates: FxHashMap<Arc<str>, Candidates> = FxHashMap::default();

    for module in modules {
        let names = exported(module);

        if !names.is_empty() {
            candidates.insert(Arc::clone(module.id), names);
        }
    }

    if candidates.is_empty() {
        return FxHashMap::default();
    }

    // A module no graph module imports may be an entry, whose exports reach readers outside the
    // graph.
    let mut imported: FxHashSet<Arc<str>> = FxHashSet::default();

    for module in modules {
        let semantic = &module.parsed.semantic;
        let target = |specifier: &str, span: Span| resolve(module.id, specifier, span);

        for statement in &module.parsed.program.body {
            match statement {
                Statement::ImportDeclaration(node)
                    if node.import_kind != ImportOrExportKind::Type && !type_only(node) =>
                {
                    let Ok(resolved) = target(&node.source.value, node.span) else {
                        return FxHashMap::default();
                    };
                    let Some(names) = resolved.and_then(|id| {
                        if id != *module.id {
                            imported.insert(Arc::clone(&id));
                        }

                        candidates.get_mut(&id)
                    }) else {
                        continue;
                    };

                    for specifier in node.specifiers.iter().flatten() {
                        let symbol = match specifier {
                            ImportDeclarationSpecifier::ImportSpecifier(specifier) => {
                                if specifier.import_kind == ImportOrExportKind::Type {
                                    continue;
                                }

                                specifier.local.symbol_id.get().map(|symbol| {
                                    (symbol, Some(specifier.imported.name().as_str()))
                                })
                            }
                            ImportDeclarationSpecifier::ImportNamespaceSpecifier(specifier) => {
                                specifier.local.symbol_id.get().map(|symbol| (symbol, None))
                            }
                            ImportDeclarationSpecifier::ImportDefaultSpecifier(_) => None,
                        };
                        let Some((symbol, name)) = symbol else {
                            names.clear();
                            continue;
                        };

                        // A namespace import reads exports as members, and a named import of an
                        // exported namespace or configuration reads that export's members.
                        let prefix = name.map_or_else(String::new, |name| format!("{name}."));
                        let binding = match name {
                            Some(name) => match names.get(name) {
                                Some(candidate) => Binding::Leaf(candidate.kind),
                                None if names.keys().any(|key| key.starts_with(&*prefix)) => {
                                    Binding::Container
                                }
                                None => continue,
                            },
                            None => Binding::Container,
                        };

                        for read in reads(semantic, symbol, binding, module) {
                            match (read, name) {
                                (Read::Consumed, _) => {}
                                (Read::Member(member, node), _) => {
                                    member_read(names, &format!("{prefix}{member}"), node, module);
                                }
                                (Read::Escaped, Some(name)) => remove(names, name),
                                (Read::Escaped, None) => names.clear(),
                            }
                        }
                    }
                }
                Statement::ExportFromDeclaration(node)
                    if node.export_kind != ImportOrExportKind::Type
                        && !node
                            .specifiers
                            .iter()
                            .all(|specifier| specifier.export_kind == ImportOrExportKind::Type) =>
                {
                    let Ok(resolved) = target(&node.source.value, node.span) else {
                        return FxHashMap::default();
                    };

                    if let Some(names) = resolved.and_then(|id| candidates.get_mut(&id)) {
                        for specifier in &node.specifiers {
                            remove(names, specifier.local.name().as_str());
                        }
                    }
                }
                Statement::ExportAllDeclaration(node)
                    if node.export_kind != ImportOrExportKind::Type =>
                {
                    let Ok(resolved) = target(&node.source.value, node.span) else {
                        return FxHashMap::default();
                    };

                    if let Some(names) = resolved.and_then(|id| candidates.get_mut(&id)) {
                        names.clear();
                    }
                }
                _ => {}
            }
        }

        // Dynamic imports, `require` calls, and `import x = require()` read the whole module
        // object. Bundler-specific module reads, such as `import.meta.glob` and
        // `require.context`, name modules the graph cannot list, so they prove nothing.
        for node in semantic.nodes().iter() {
            let (specifier, span) = match node.kind() {
                AstKind::ImportExpression(node) => match &node.source {
                    Expression::StringLiteral(literal) => (&literal.value, node.span),
                    _ => return FxHashMap::default(),
                },
                AstKind::TSImportEqualsDeclaration(node)
                    if node.import_kind != ImportOrExportKind::Type =>
                {
                    match &node.module_reference {
                        TSModuleReference::ExternalModuleReference(reference) => {
                            (&reference.expression.value, node.span)
                        }
                        _ => continue,
                    }
                }
                AstKind::CallExpression(call) => match &call.callee {
                    Expression::Identifier(callee)
                        if callee.name == "require"
                            && semantic.is_reference_to_global_variable(callee) =>
                    {
                        match call.arguments.first() {
                            Some(Argument::StringLiteral(literal)) => (&literal.value, call.span),
                            _ => return FxHashMap::default(),
                        }
                    }
                    Expression::StaticMemberExpression(member)
                        if matches!(&member.object, Expression::ImportMeta(_))
                            || matches!(&member.object, Expression::Identifier(object)
                                if object.name == "require"
                                    && semantic.is_reference_to_global_variable(object)) =>
                    {
                        return FxHashMap::default();
                    }
                    _ => continue,
                },
                _ => continue,
            };
            let Ok(resolved) = target(specifier, span) else {
                return FxHashMap::default();
            };

            if let Some(names) = resolved.and_then(|id| candidates.get_mut(&id)) {
                names.clear();
            }
        }
    }

    candidates
        .into_iter()
        .filter(|(id, names)| !names.is_empty() && imported.contains(id))
        .map(|(id, names)| {
            let mut unused = Unused::default();

            for candidate in names.into_values() {
                match candidate.kind {
                    Kind::Definition => unused.definitions.insert(candidate.name),
                    Kind::Selector => unused.selectors.insert(candidate.name),
                };
            }

            (id, unused)
        })
        .collect()
}

/// Keeps a member read of a container when it reaches a candidate the rewritten module no longer
/// reads, and removes the path otherwise, since a read of an unlisted path may hold members.
fn member_read(names: &mut Candidates, path: &str, node: NodeId, module: &Module<'_, '_>) {
    let kept = names
        .get(path)
        .is_some_and(|candidate| consumed(&module.parsed.semantic, node, candidate.kind, module));

    if !kept {
        remove(names, path);
    }
}

/// Removes an export path and every member path beneath it.
fn remove(names: &mut Candidates, path: &str) {
    names.retain(|key, _| {
        key != path
            && !key
                .strip_prefix(path)
                .is_some_and(|rest| rest.starts_with('.'))
    });
}

/// Whether every specifier of an import is a type, so the import reads nothing at runtime.
fn type_only(node: &oxc_ast::ast::ImportDeclaration<'_>) -> bool {
    node.specifiers.as_ref().is_some_and(|specifiers| {
        !specifiers.is_empty()
            && specifiers.iter().all(|specifier| {
                matches!(specifier, ImportDeclarationSpecifier::ImportSpecifier(specifier)
                    if specifier.import_kind == ImportOrExportKind::Type)
            })
    })
}

/// Exports bound by top-level `export const` declarations, and by `export const` members of
/// top-level exported namespaces, whose own module reads them only in consumed ways.
fn exported(module: &Module<'_, '_>) -> Candidates {
    let semantic = &module.parsed.semantic;
    let mut names = Candidates::default();

    for statement in &module.parsed.program.body {
        let Statement::ExportDeclaration(node) = statement else {
            continue;
        };

        match &node.declaration {
            Declaration::VariableDeclaration(declaration) => {
                declared(module, declaration, "", &mut names);
            }
            Declaration::TSNamespaceDeclaration(namespace) => {
                let TSNamespaceDeclarationBody::TSModuleBlock(block) = &namespace.body else {
                    continue;
                };
                let Some(symbol) = namespace.id.symbol_id.get() else {
                    continue;
                };
                let prefix = format!("{}.", namespace.id.name);
                let mut members = Candidates::default();

                for member in &block.body {
                    if let Statement::ExportDeclaration(member) = member
                        && let Declaration::VariableDeclaration(declaration) = &member.declaration
                    {
                        declared(module, declaration, &prefix, &mut members);
                    }
                }

                for read in reads(semantic, symbol, Binding::Container, module) {
                    match read {
                        Read::Consumed => {}
                        Read::Escaped => members.clear(),
                        Read::Member(member, node) => {
                            member_read(&mut members, &format!("{prefix}{member}"), node, module);
                        }
                    }
                }

                names.extend(members);
            }
            _ => {}
        }
    }

    names
}

/// Adds the exports a `const` declaration binds, under `prefix`, when the module reads each
/// binding only in consumed ways: a plain style definition, the `vars` selector destructured
/// from a variable configuration, or the `vars` member of a whole variable configuration.
fn declared(
    module: &Module<'_, '_>,
    declaration: &oxc_ast::ast::VariableDeclaration<'_>,
    prefix: &str,
    names: &mut Candidates,
) {
    let semantic = &module.parsed.semantic;

    if declaration.kind != VariableDeclarationKind::Const {
        return;
    }

    for declarator in &declaration.declarations {
        let Some(init) = &declarator.init else {
            continue;
        };
        let start = init.span().start;

        match &declarator.id {
            BindingPattern::BindingIdentifier(identifier) => {
                let Some(symbol) = identifier.symbol_id.get() else {
                    continue;
                };

                if let Some(name) = module.definitions.get(&start) {
                    if reads(semantic, symbol, Binding::Leaf(Kind::Definition), module)
                        .all(|read| matches!(read, Read::Consumed))
                    {
                        names.insert(
                            format!("{prefix}{}", identifier.name),
                            Candidate {
                                kind: Kind::Definition,
                                name: Arc::clone(name),
                            },
                        );
                    }

                    continue;
                }

                // A whole configuration escapes with its selector, and its other members hold no
                // selector.
                let Some(key) = module.selectors.get(&start) else {
                    continue;
                };
                let consumed =
                    reads(semantic, symbol, Binding::Container, module).all(|read| match read {
                        Read::Escaped => false,
                        Read::Member("vars", node) => {
                            consumed(semantic, node, Kind::Selector, module)
                        }
                        Read::Consumed | Read::Member(_, _) => true,
                    });

                if consumed {
                    names.insert(
                        format!("{prefix}{}.vars", identifier.name),
                        Candidate {
                            kind: Kind::Selector,
                            name: Arc::clone(key),
                        },
                    );
                }
            }
            // A rest element would hold the selector.
            BindingPattern::ObjectPattern(pattern) if pattern.rest.is_none() => {
                let Some(key) = module.selectors.get(&start) else {
                    continue;
                };

                for property in &pattern.properties {
                    let (
                        PropertyKey::StaticIdentifier(name),
                        BindingPattern::BindingIdentifier(identifier),
                    ) = (&property.key, &property.value)
                    else {
                        continue;
                    };
                    let Some(symbol) = identifier.symbol_id.get() else {
                        continue;
                    };

                    if name.name == "vars"
                        && reads(semantic, symbol, Binding::Leaf(Kind::Selector), module)
                            .all(|read| matches!(read, Read::Consumed))
                    {
                        names.insert(
                            format!("{prefix}{}", identifier.name),
                            Candidate {
                                kind: Kind::Selector,
                                name: Arc::clone(key),
                            },
                        );
                    }
                }
            }
            _ => {}
        }
    }
}

/// Classifies each value reference of a binding. Type references read nothing at runtime.
fn reads<'s, 'a>(
    semantic: &'s Semantic<'a>,
    symbol: SymbolId,
    binding: Binding,
    module: &'s Module<'_, '_>,
) -> impl Iterator<Item = Read<'a>> + 's {
    semantic
        .symbol_references(symbol)
        .filter(|reference| reference.is_value())
        .map(move |reference| read(semantic, reference.node_id(), binding, module))
}

/// Classifies one reference: a consumed read of one export, a static member read of a container,
/// or any other read.
fn read<'a>(
    semantic: &Semantic<'a>,
    id: NodeId,
    binding: Binding,
    module: &Module<'_, '_>,
) -> Read<'a> {
    let nodes = semantic.nodes();

    match binding {
        Binding::Leaf(kind) => {
            if consumed(semantic, id, kind, module) {
                Read::Consumed
            } else {
                Read::Escaped
            }
        }
        Binding::Container => {
            let parent = nodes.parent_id(id);

            match nodes.kind(parent) {
                AstKind::StaticMemberExpression(expression)
                    if !expression.optional
                        && expression.object.span() == nodes.kind(id).span() =>
                {
                    Read::Member(expression.property.name.as_str(), parent)
                }
                _ => Read::Escaped,
            }
        }
    }
}

/// Whether the rewritten module no longer reads the export at `id`: a style definition applied
/// where a composition replaces the class list, or a variable selector called with folded
/// literal arguments or read for a token, which extraction accepts only as a direct property
/// value of a bound style call.
fn consumed(semantic: &Semantic<'_>, id: NodeId, kind: Kind, module: &Module<'_, '_>) -> bool {
    let nodes = semantic.nodes();
    let span = nodes.kind(id).span();

    match nodes.kind(nodes.parent_id(id)) {
        AstKind::CallExpression(call) if !call.optional && call.callee.span() == span => match kind
        {
            Kind::Definition => module.replaced.contains(&call.span.start),
            Kind::Selector => module.folded.contains(&call.span.start),
        },
        AstKind::StaticMemberExpression(expression)
            if !expression.optional && expression.object.span() == span =>
        {
            matches!(kind, Kind::Selector)
        }
        _ => false,
    }
}
