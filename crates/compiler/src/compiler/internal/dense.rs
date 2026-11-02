//! Renames the hashed choice-class prefixes and keyframes of a module to dense graph-wide names
//! before the module is transformed.
//!
//! Extraction names a recipe's choice classes from its definition identity, so an extracted module
//! stays valid in any graph. A dense table instead allocates names in graph compilation order, so
//! the rename runs once per transform over the module's own recipes and the compositions that
//! copy their rules. Prefixes of packed libraries keep their published names, since the library's
//! stylesheet prints them.
//!
//! Extraction likewise names a `@keyframes` definition from its module qualifier and binding, and
//! bakes that name into every style value that reads the binding. A graph allocates dense
//! keyframe names up front from every module's contributions, so each module renames its
//! definitions, its binding constants, and the names its values carry from the same table.

use std::sync::Arc;

use rustc_hash::{FxHashMap, FxHashSet};

use crate::compiler::internal::recipes;
use crate::compiler::source::{Call, Extracted};
use crate::internal::token::{Expression, Part};
use crate::js;
use crate::style::{Declaration, NamedStyle, Rule, Targets, Value};
use crate::web::internal::class_name::Units;
use crate::web::internal::contributions::{Definition, Kind};

/// Dense keyframe names keyed by the extracted names they replace.
pub type Keyframes = FxHashMap<Arc<str>, Arc<str>>;

/// Hashed prefixes and the dense prefixes that replace them.
type Renamed = FxHashMap<Arc<str>, Arc<str>>;

/// Replaces every module-owned choice-class prefix with a dense prefix from `units`. Recipes are
/// named first, in source order, then the copies each composition renames, in source order, so the
/// table allocates the same names whenever the module compiles after the same modules. `flat`
/// marks the compositions that compose flat, which name the module's shared override copies
/// instead of renamed recipe rules.
pub fn rename(
    extracted: &mut Extracted<'_>,
    units: &mut Units<'_>,
    flat: impl Fn(&Call<'_>) -> bool,
) {
    let mut renamed = Renamed::default();

    for call in &mut extracted.calls {
        if let Some(recipe) = &mut call.recipe
            && let Some(prefix) = &recipe.prefix
        {
            recipe.prefix = Some(allocate(&mut renamed, units, prefix));
        }
    }

    // A flat composition and its presence alternatives print no renamed recipe rules.
    let skipped: FxHashSet<Arc<str>> = extracted
        .calls
        .iter()
        .filter(|call| flat(call))
        .flat_map(|call| call.composition_cases.iter().flatten().cloned())
        .collect();
    // A module whose flat compositions have no conflicts names no copies.
    let copies = extracted
        .calls
        .iter()
        .filter(|call| flat(call))
        .filter_map(|call| call.composition_flat.as_ref())
        .any(|plan| {
            plan.inputs
                .iter()
                .any(|input| !input.classes.is_empty() || !input.choices.is_empty())
        });

    for call in &mut extracted.calls {
        if flat(call) {
            // The flat compositions of a module share one prefix, allocated on its first use.
            if copies && let Some(plan) = &mut call.composition_flat {
                plan.prefix = allocate(&mut renamed, units, &plan.prefix);
            }

            continue;
        }

        if skipped.contains(&call.name) {
            continue;
        }

        for (_, _, to) in call.composition_renames.iter_mut().flatten() {
            *to = allocate(&mut renamed, units, to);
        }
    }

    if renamed.is_empty() {
        return;
    }

    for plan in extracted
        .calls
        .iter_mut()
        .filter_map(|call| call.composition_flat.as_mut())
    {
        for input in &mut plan.inputs {
            for class in
                input
                    .classes
                    .iter_mut()
                    .chain(input.choices.iter_mut().flat_map(|(choice, classes)| {
                        std::iter::once(choice).chain(classes.iter_mut())
                    }))
            {
                if let Some(dense) = rename_class(class, &renamed) {
                    *class = dense;
                }
            }
        }
    }

    for call in &mut extracted.calls {
        // A composition copies a packed recipe's rules under its own prefix as well, and that
        // recipe keeps its published prefix.
        for (_, from, _) in call.composition_renames.iter_mut().flatten() {
            if let Some(dense) = renamed.get(from) {
                *from = Arc::clone(dense);
            }
        }

        for owner in call
            .runtime_composition
            .iter_mut()
            .flatten()
            .flat_map(|input| input.owners.iter_mut())
        {
            for prefix in &mut owner.prefixes {
                if let Some(dense) = renamed.get(prefix) {
                    *prefix = Arc::clone(dense);
                }
            }
        }
    }

    for style in &mut extracted.styles.styles {
        if let Some(updated) = rename_style(style, &renamed) {
            *style = updated;
        }
    }
}

/// The dense prefix of a hashed prefix, allocated on first use.
fn allocate(renamed: &mut Renamed, units: &mut Units<'_>, hashed: &Arc<str>) -> Arc<str> {
    if let Some(dense) = renamed.get(hashed) {
        return Arc::clone(dense);
    }

    let dense: Arc<str> = Arc::from(units.prefix(hashed));

    renamed.insert(Arc::clone(hashed), Arc::clone(&dense));
    dense
}

/// The style with every renamed class rule replaced, or `None` when none of its rules changed.
fn rename_style(style: &Arc<NamedStyle>, renamed: &Renamed) -> Option<Arc<NamedStyle>> {
    let rules = style.rules.as_ref()?;
    let mut changed = false;
    let rules: Vec<Rule> = rules
        .iter()
        .map(|rule| {
            let class = rule
                .class
                .as_deref()
                .and_then(|class| rename_class(class, renamed));
            let nested = rename_style(&rule.style, renamed);

            changed |= class.is_some() || nested.is_some();

            Rule {
                class: class.or_else(|| rule.class.clone()),
                condition: rule.condition.clone(),
                style: nested.unwrap_or_else(|| Arc::clone(&rule.style)),
            }
        })
        .collect();

    changed.then(|| {
        Arc::new(NamedStyle {
            rules: Some(rules),
            ..(**style).clone()
        })
    })
}

/// A choice class under its dense prefix, or `None` when its hashed prefix was not renamed.
fn rename_class(class: &str, renamed: &Renamed) -> Option<Arc<str>> {
    let (prefix, rest) = class.split_at_checked(recipes::PREFIX_LENGTH)?;
    let dense = renamed.get(prefix)?;

    Some(Arc::from(format!("{dense}{rest}")))
}

/// Allocates one dense name per `@keyframes` contribution, in the given order, as `z` and a
/// base-36 index. Animation names share no namespace with classes, so the table starts at zero.
pub fn keyframes<'c>(contributions: impl IntoIterator<Item = &'c Definition>) -> Keyframes {
    let mut renamed = Keyframes::default();

    for definition in contributions {
        let Kind::Keyframes { name, .. } = &definition.kind else {
            continue;
        };

        if renamed.contains_key(name) {
            continue;
        }

        let dense: Arc<str> = format!("z{}", js::radix(renamed.len() as u64, 36)).into();

        renamed.insert(Arc::clone(name), dense);
    }

    renamed
}

/// Replaces every keyframe name of `renamed` in the module's contributions, in the constants
/// that bind its own definitions, and in the values of its styles.
pub fn rename_keyframes(extracted: &mut Extracted<'_>, renamed: &Keyframes) {
    for definition in &mut extracted.contributions {
        if let Some(updated) = rename_contribution(definition, renamed) {
            *definition = updated;
        }
    }

    for call in &mut extracted.contribution_calls {
        if let Some(dense) = call.name.as_ref().and_then(|name| renamed.get(name)) {
            call.name = Some(Arc::clone(dense));
        }
    }

    for style in &mut extracted.styles.styles {
        if let Some(updated) = rename_keyframes_style(style, renamed) {
            *style = updated;
        }
    }
}

/// The contribution with its keyframe names replaced, or `None` when it carries none. A
/// `@keyframes` definition renames itself and its frames, and a global rule renames its values.
pub fn rename_contribution(definition: &Definition, renamed: &Keyframes) -> Option<Definition> {
    let kind = match &definition.kind {
        Kind::Keyframes { frames, name } => {
            let dense = renamed.get(name);
            let mut changed = dense.is_some();
            let frames: Vec<(Arc<str>, Arc<NamedStyle>)> = frames
                .iter()
                .map(|(selector, style)| {
                    let updated = rename_keyframes_style(style, renamed);

                    changed |= updated.is_some();

                    (
                        Arc::clone(selector),
                        updated.unwrap_or_else(|| Arc::clone(style)),
                    )
                })
                .collect();

            changed.then(|| Kind::Keyframes {
                frames,
                name: dense.map_or_else(|| Arc::clone(name), Arc::clone),
            })
        }
        Kind::Rule { selector, style } => {
            rename_keyframes_style(style, renamed).map(|style| Kind::Rule {
                selector: Arc::clone(selector),
                style,
            })
        }
        _ => None,
    }?;

    Some(Definition {
        kind,
        within: definition.within.clone(),
    })
}

/// The style with every keyframe name in its values replaced, or `None` when none changed.
fn rename_keyframes_style(style: &Arc<NamedStyle>, renamed: &Keyframes) -> Option<Arc<NamedStyle>> {
    let mut changed = false;
    let declarations: Vec<Declaration> = style
        .declarations
        .iter()
        .map(
            |declaration| match rename_value(&declaration.value, renamed) {
                Some(value) => {
                    changed = true;

                    Declaration {
                        value,
                        ..declaration.clone()
                    }
                }
                None => declaration.clone(),
            },
        )
        .collect();
    let rules: Option<Vec<Rule>> = style.rules.as_ref().map(|rules| {
        rules
            .iter()
            .map(|rule| match rename_keyframes_style(&rule.style, renamed) {
                Some(nested) => {
                    changed = true;

                    Rule {
                        style: nested,
                        ..rule.clone()
                    }
                }
                None => rule.clone(),
            })
            .collect()
    });
    let targets: Option<Targets> = style.targets.as_ref().map(|targets| {
        match targets
            .web
            .as_ref()
            .and_then(|web| rename_keyframes_style(web, renamed))
        {
            Some(web) => {
                changed = true;

                Targets {
                    web: Some(web),
                    ..targets.clone()
                }
            }
            None => targets.clone(),
        }
    });

    changed.then(|| {
        Arc::new(NamedStyle {
            declarations,
            rules,
            targets,
            ..(**style).clone()
        })
    })
}

/// The value with every keyframe name replaced, or `None` when it names none.
fn rename_value(value: &Value, renamed: &Keyframes) -> Option<Value> {
    match value {
        Value::String(text) => rename_text(text, renamed).map(|text| Value::String(text.into())),
        Value::Expression(expression) => {
            let mut changed = false;
            let parts: Vec<Part> = expression
                .parts
                .iter()
                .map(|part| match part {
                    Part::Text(text) => match rename_text(text, renamed) {
                        Some(text) => {
                            changed = true;
                            Part::Text(text.into())
                        }
                        None => part.clone(),
                    },
                    _ => part.clone(),
                })
                .collect();

            changed.then(|| {
                Value::Expression(Arc::new(Expression {
                    group: expression.group.clone(),
                    parts,
                }))
            })
        }
        _ => None,
    }
}

/// `text` with every whole identifier that names a keyframe in `renamed` replaced, or `None`
/// when it names none. Extracted keyframe names start with `z-k`, so only those tokens are read.
fn rename_text(text: &str, renamed: &Keyframes) -> Option<String> {
    let bytes = text.as_bytes();
    let mut output = String::new();
    let mut last = 0;

    for (index, _) in text.match_indices("z-k") {
        if index < last
            || index
                .checked_sub(1)
                .and_then(|previous| bytes.get(previous))
                .is_some_and(|byte| is_ident(*byte))
        {
            continue;
        }

        let end = bytes
            .get(index..)
            .and_then(|rest| rest.iter().position(|byte| !is_ident(*byte)))
            .map_or(text.len(), |length| index + length);
        let Some(dense) = text.get(index..end).and_then(|token| renamed.get(token)) else {
            continue;
        };

        output.push_str(text.get(last..index).unwrap_or_default());
        output.push_str(dense);
        last = end;
    }

    if last == 0 {
        return None;
    }

    output.push_str(text.get(last..).unwrap_or_default());
    Some(output)
}

/// Whether a byte continues a CSS identifier. Every non-ASCII byte does.
const fn is_ident(byte: u8) -> bool {
    byte.is_ascii_alphanumeric() || byte == b'-' || byte == b'_' || byte >= 0x80
}
