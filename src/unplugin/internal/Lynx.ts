/** Lowers class-selection variant rules into the flat class rules that the Lynx template encoder keeps. @module */
import type * as Lightning from 'lightningcss'

// `zv`, an 8-character recipe hash, and a base-36 choice position. Conditional choice
// classes and override markers append `_` or `-` with a condition index and stay nested.
const choicePattern = /^zv[\w-]{8}[0-9a-z]+$/
const compoundPattern = /^__zyzz-compound-\d+$/

/**
 * Replaces a class-selection choice rule, `.z{&:where(.choice){…}}`, with `.choice{…}`, and a
 * compound with a rule listing every matched class combination.
 *
 * The Lynx template encoder drops nested rules and every `:where()` selector. Applications
 * add a choice class only beside its recipe class, so a lowered choice keeps the specificity of
 * the `:where()` rule. A lowered compound gains one class for each additional axis it matches.
 * @param rule - One stylesheet rule.
 * @returns The flat rule, or `undefined` when the rule is not a lowerable choice rule.
 */
export function flatten(rule: Lightning.Rule): Lightning.Rule[] | undefined {
  if (rule.type !== 'style') return

  const { declarations, rules = [], selectors } = rule.value
  const [selector, ...others] = selectors
  const [nested, ...siblings] = rules
  if (others.length || selector?.length !== 1 || selector[0]?.type !== 'class')
    return
  if (
    declarations?.declarations?.length ||
    declarations?.importantDeclarations?.length
  )
    return
  if (siblings.length || nested?.type !== 'style' || nested.value.rules?.length)
    return

  const lowered = combinations(nested.value.selectors)
  if (!lowered) return

  return [{ type: 'style', value: { ...nested.value, selectors: lowered } }]
}

/** The class combinations that `&:where(…)…` matches, when every group lists only choice classes. */
function combinations(selectors: Lightning.SelectorList) {
  const [selector, ...others] = selectors
  if (others.length || !selector) return

  const [nesting, ...components] = selector
  if (nesting?.type !== 'nesting' || !components.length) return

  let output: Lightning.Selector[] = [[]]

  for (const [index, component] of components.entries()) {
    if (component.type !== 'pseudo-class' || component.kind !== 'where') return

    // `:where(*, .__zyzz-compound-N)` matches every element and only keeps repeated compounds distinct.
    if (
      index > 0 &&
      index === components.length - 1 &&
      marker(component.selectors)
    )
      continue

    const classes: Lightning.SelectorComponent[] = []

    for (const alternative of component.selectors) {
      const [first, ...rest] = alternative
      if (rest.length || first?.type !== 'class') return
      if (!choicePattern.test(first.name)) return
      classes.push(first)
    }

    output = output.flatMap((prefix) =>
      classes.map((choice) => [...prefix, choice]),
    )
  }

  return output
}

function marker(selectors: readonly Lightning.Selector[]) {
  const [universal, compound, ...rest] = selectors

  return (
    !rest.length &&
    universal?.length === 1 &&
    universal[0]?.type === 'universal' &&
    compound?.length === 1 &&
    compound[0]?.type === 'class' &&
    compoundPattern.test(compound[0].name)
  )
}
