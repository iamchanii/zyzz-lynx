//! Renames the hashed choice-class prefixes of a module to dense graph-wide prefixes before the
//! module is transformed.
//!
//! Extraction names a recipe's choice classes from its definition identity, so an extracted module
//! stays valid in any graph. A dense table instead allocates names in graph compilation order, so
//! the rename runs once per transform over the module's own recipes and the compositions that
//! copy their rules. Prefixes of packed libraries keep their published names, since the library's
//! stylesheet prints them.

use std::sync::Arc;

use rustc_hash::FxHashMap;

use crate::compiler::internal::recipes;
use crate::compiler::source::Extracted;
use crate::style::{NamedStyle, Rule};
use crate::web::internal::class_name::Units;

/// Hashed prefixes and the dense prefixes that replace them.
type Renamed = FxHashMap<Arc<str>, Arc<str>>;

/// Replaces every module-owned choice-class prefix with a dense prefix from `units`. Recipes are
/// named first, in source order, then the copies each composition renames, in source order, so the
/// table allocates the same names whenever the module compiles after the same modules.
pub fn rename(extracted: &mut Extracted<'_>, units: &mut Units<'_>) {
    let mut renamed = Renamed::default();

    for call in &mut extracted.calls {
        if let Some(recipe) = &mut call.recipe
            && let Some(prefix) = &recipe.prefix
        {
            recipe.prefix = Some(allocate(&mut renamed, units, prefix));
        }
    }

    for call in &mut extracted.calls {
        for (_, _, to) in call.composition_renames.iter_mut().flatten() {
            *to = allocate(&mut renamed, units, to);
        }
    }

    if renamed.is_empty() {
        return;
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
