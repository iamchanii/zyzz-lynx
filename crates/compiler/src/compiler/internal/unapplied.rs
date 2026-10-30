//! Proves which exported style definitions of a complete graph no module applies outside the
//! compositions that replace their class lists, so their rules can be left out.
//!
//! The proof reads bindings, not identifier text. Every value reference of an exported binding,
//! in its own module and through each import of it, must be the callee of an application whose
//! class list a composition replaces. A member of an exported namespace qualifies the same way
//! through reads of the namespace. Any other read, re-export, default or dynamic import, or
//! `require` call keeps the definition, as does a module that no graph module imports.

use std::sync::Arc;

use oxc_ast::AstKind;
use oxc_ast::ast::{
    Argument, BindingPattern, Declaration, Expression, ImportDeclarationSpecifier,
    ImportOrExportKind, Statement, TSModuleReference, TSNamespaceDeclarationBody,
    VariableDeclarationKind,
};
use oxc_semantic::Semantic;
use oxc_span::{GetSpan, Span};
use oxc_syntax::node::NodeId;
use oxc_syntax::symbol::SymbolId;
use rustc_hash::{FxHashMap, FxHashSet};

use crate::compiler::internal::syntax::Parsed;

/// Names of the definitions left without rules, by module identity.
pub type Definitions = FxHashMap<Arc<str>, FxHashSet<Arc<str>>>;

/// One parsed module of the graph.
pub struct Module<'m, 'a> {
    /// Names of the module's plain style definitions, which hold no composition, by call start.
    pub definitions: FxHashMap<u32, &'m Arc<str>>,
    /// Stable module identity.
    pub id: &'m Arc<str>,
    /// The parsed module.
    pub parsed: &'m Parsed<'a>,
    /// Starts of applications whose class lists compositions replace.
    pub replaced: &'m FxHashSet<u32>,
}

/// Definition names by export path, such as `field` or `styles.field` for a namespace member.
type Candidates = FxHashMap<String, Arc<str>>;

/// How a binding reference reads a style definition.
enum Read<'a> {
    /// A read that may reach the definition's class list.
    Escaped,
    /// Any read of the named namespace member other than a replaced application.
    Member(&'a str),
    /// An application a composition replaces.
    Replaced,
}

/// Names of exported definitions that no module applies outside replacing compositions, by module
/// identity. `resolve` maps a specifier of a module to the identity of a graph module, and
/// returns `Err(())` when it cannot tell, which proves nothing.
pub fn collect(
    modules: &[Module<'_, '_>],
    resolve: impl Fn(&str, &str, Span) -> Result<Option<Arc<str>>, ()>,
) -> Definitions {
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
                        // exported namespace reads that namespace's members.
                        let prefix = name.map(|name| format!("{name}."));
                        let namespace = match &prefix {
                            Some(prefix) => names.keys().any(|key| key.starts_with(&**prefix)),
                            None => true,
                        };

                        for read in reads(semantic, symbol, namespace, module.replaced) {
                            match (read, &prefix, name) {
                                (Read::Replaced, _, _) => {}
                                (Read::Member(member), Some(prefix), _) => {
                                    remove(names, &format!("{prefix}{member}"));
                                }
                                (Read::Member(member), None, _) => remove(names, member),
                                (Read::Escaped, _, Some(name)) => remove(names, name),
                                (Read::Escaped, _, None) => names.clear(),
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
        .map(|(id, names)| (id, names.into_values().collect()))
        .collect()
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

/// Plain definitions bound by top-level `export const` declarations, and by `export const`
/// members of top-level exported namespaces, whose own module reads them only through replaced
/// applications.
fn exported(module: &Module<'_, '_>) -> Candidates {
    let semantic = &module.parsed.semantic;
    let mut names = Candidates::default();

    for statement in &module.parsed.program.body {
        let Statement::ExportDeclaration(node) = statement else {
            continue;
        };

        match &node.declaration {
            Declaration::VariableDeclaration(declaration) => {
                definitions(module, declaration, "", &mut names);
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
                        definitions(module, declaration, &prefix, &mut members);
                    }
                }

                for read in reads(semantic, symbol, true, module.replaced) {
                    match read {
                        Read::Escaped => members.clear(),
                        Read::Member(member) => remove(&mut members, &format!("{prefix}{member}")),
                        Read::Replaced => {}
                    }
                }

                names.extend(members);
            }
            _ => {}
        }
    }

    names
}

/// Adds the plain definitions a `const` declaration binds, under `prefix`, when every read of
/// each binding is a replaced application.
fn definitions(
    module: &Module<'_, '_>,
    declaration: &oxc_ast::ast::VariableDeclaration<'_>,
    prefix: &str,
    names: &mut Candidates,
) {
    if declaration.kind != VariableDeclarationKind::Const {
        return;
    }

    for declarator in &declaration.declarations {
        let BindingPattern::BindingIdentifier(identifier) = &declarator.id else {
            continue;
        };
        let Some(symbol) = identifier.symbol_id.get() else {
            continue;
        };

        if let Some(init) = &declarator.init
            && let Some(name) = module.definitions.get(&init.span().start)
            && reads(&module.parsed.semantic, symbol, false, module.replaced)
                .all(|read| matches!(read, Read::Replaced))
        {
            names.insert(format!("{prefix}{}", identifier.name), Arc::clone(name));
        }
    }
}

/// Classifies each value reference of a binding. Type references read nothing at runtime.
fn reads<'s, 'a>(
    semantic: &'s Semantic<'a>,
    symbol: SymbolId,
    namespace: bool,
    replaced: &'s FxHashSet<u32>,
) -> impl Iterator<Item = Read<'a>> + 's {
    semantic
        .symbol_references(symbol)
        .filter(|reference| reference.is_value())
        .map(move |reference| read(semantic, reference.node_id(), namespace, replaced))
}

/// Classifies one reference: a replaced application of the binding, or of its static member when
/// the binding is a namespace, or any other read.
fn read<'a>(
    semantic: &Semantic<'a>,
    id: NodeId,
    namespace: bool,
    replaced: &FxHashSet<u32>,
) -> Read<'a> {
    let nodes = semantic.nodes();
    let mut callee = nodes.kind(id).span();
    let mut parent = nodes.parent_id(id);
    let mut member = None;

    if namespace {
        match nodes.kind(parent) {
            AstKind::StaticMemberExpression(expression)
                if !expression.optional && expression.object.span() == callee =>
            {
                member = Some(expression.property.name.as_str());
                callee = expression.span;
                parent = nodes.parent_id(parent);
            }
            _ => return Read::Escaped,
        }
    }

    match nodes.kind(parent) {
        AstKind::CallExpression(call)
            if !call.optional
                && call.callee.span() == callee
                && replaced.contains(&call.span.start) =>
        {
            Read::Replaced
        }
        _ => member.map_or(Read::Escaped, Read::Member),
    }
}
