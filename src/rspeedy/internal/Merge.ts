/**
 * Merges the atomic class rules that every class list of a Lynx bundle applies together.
 *
 * Independent composition prints one rule per declaration and lists several classes on each
 * element. Units whose usage sets are identical, the set of class-list string literals in the
 * thread scripts that name them, always reach an element together, so one rule under the first
 * member's name can hold their declarations in stylesheet order. The pass works on the bundler's
 * chunk assets, since a module's class names are fixed before later modules compile, and edits
 * only the spans it rewrites so source maps stay aligned.
 * @module
 */
import * as CssTree from 'css-tree'
import * as Parser from 'oxc-parser'

/**
 * Plans the merge over every stylesheet and script of one bundle. Members are top-level rules of
 * one class with a dense unit name, selected by no other rule, whose declarations hold no nested
 * rules. A group is skipped when a rule between its first and last member declares a property
 * that could set a longhand a moved member sets, since the move could change which declaration
 * wins on an element that carries both.
 */
export function plan(options: plan.Options): plan.ReturnType {
  const names = Object.keys(options.stylesheets).sort()
  const entries = names.flatMap((name) =>
    rules(name, options.stylesheets[name]!),
  )

  const selected = new Map<string, number>()
  for (const entry of entries)
    for (const name of entry.classes)
      selected.set(name, (selected.get(name) ?? 0) + 1)

  const candidates = new Map<string, Entry>()
  for (const entry of entries)
    if (
      entry.name !== undefined &&
      unitPattern.test(entry.name) &&
      selected.get(entry.name) === 1
    )
      candidates.set(entry.name, entry)

  const literals = Object.keys(options.scripts)
    .sort()
    .flatMap((name) => lists(name, options.scripts[name]!, selected))
  const usage = new Map<string, string[]>()
  for (const literal of literals)
    for (const token of literal.tokens)
      if (candidates.has(token))
        (usage.get(token) ?? usage.set(token, []).get(token)!).push(
          `${literal.asset}\0${literal.start}`,
        )

  // Every token's identifiers follow one traversal order, so equal sets print equal keys.
  const groups = new Map<string, Entry[]>()
  for (const [name, identifiers] of usage) {
    const entry = candidates.get(name)!
    const key = `${entry.asset}\0${identifiers.join('\0')}`
    ;(groups.get(key) ?? groups.set(key, []).get(key)!).push(entry)
  }

  const merged: Entry[][] = []
  let excluded = 0
  for (const members of groups.values()) {
    if (members.length < 2) continue
    members.sort((a, b) => a.index - b.index)
    if (safe(entries, members)) merged.push(members)
    else excluded++
  }
  merged.sort((a, b) => a[0]!.index - b[0]!.index)

  const removed = new Map<string, string>()
  for (const members of merged)
    for (const member of members.slice(1))
      removed.set(member.name!, members[0]!.name!)

  const edits: Record<string, Edit[]> = {}
  const push = (asset: string, edit: Edit) => (edits[asset] ??= []).push(edit)

  for (const members of merged) {
    const [first, ...rest] = members
    const css = options.stylesheets[first!.asset]!
    push(first!.asset, {
      end: first!.bodyEnd - 1,
      start: first!.bodyStart + 1,
      text: members
        .map((member) =>
          css
            .slice(member.bodyStart + 1, member.bodyEnd - 1)
            .trim()
            .replace(/;\s*$/, ''),
        )
        .join(';'),
    })
    for (const member of rest)
      push(member.asset, { end: member.end, start: member.start, text: '' })
  }

  for (const literal of literals) {
    if (!literal.tokens.some((token) => removed.has(token))) continue
    const kept = literal.tokens.filter((token) => !removed.has(token))
    push(literal.asset, {
      end: literal.end,
      start: literal.start,
      text: `${literal.leading ? ' ' : ''}${kept.join(' ')}${literal.trailing ? ' ' : ''}`,
    })
  }

  for (const list of Object.values(edits))
    list.sort((a, b) => a.start - b.start)

  return {
    edits,
    excluded,
    merged: merged.map((members) => members.map((member) => member.name!)),
  }
}

export declare namespace plan {
  type Options = {
    /** Thread scripts by asset name, whose string literals name the classes elements receive. */
    readonly scripts: Readonly<Record<string, string>>
    /** Stylesheets by asset name, whose rules the merge rewrites. */
    readonly stylesheets: Readonly<Record<string, string>>
  }

  type ReturnType = {
    /** Non-overlapping text edits by asset name, in ascending order. */
    readonly edits: Readonly<Record<string, readonly Edit[]>>
    /** Groups of co-used units the cascade check kept apart. */
    readonly excluded: number
    /** The class names of each merged group, first member first, in stylesheet order. */
    readonly merged: readonly (readonly string[])[]
  }
}

/** A replacement of the text between two offsets of one asset. */
export type Edit = {
  /** Offset after the last replaced character. */
  readonly end: number
  /** Offset of the first replaced character. */
  readonly start: number
  /** Replacement text. */
  readonly text: string
}

type Entry = {
  readonly asset: string
  readonly bodyEnd: number
  readonly bodyStart: number
  readonly classes: readonly string[]
  readonly declarations: readonly string[]
  readonly end: number
  readonly index: number
  readonly name: string | undefined
  readonly start: number
}

type Literal = {
  readonly asset: string
  readonly end: number
  readonly leading: boolean
  readonly start: number
  readonly tokens: readonly string[]
  readonly trailing: boolean
}

// Dense unit names, as opposed to recipe prefixes and composition copies, which carry a capital
// letter, and to readable development names, which carry hyphens.
const unitPattern = /^z[0-9a-z]+$/
// Grouping at-rules whose nested rules take part in the cascade.
const conditional = new Set([
  'container',
  'document',
  'layer',
  'media',
  'scope',
  'starting-style',
  'supports',
])
// Property families whose members overlap through shorthands, sides, and logical variants in
// ways a name prefix does not spell, so any two members count as a conflict.
const families = new Set([
  'border',
  'inset',
  'margin',
  'overflow',
  'padding',
  'scroll',
])
// Properties that set, or are set by, properties their name does not prefix.
const aliases: Readonly<Record<string, readonly string[]>> = {
  'block-size': ['height'],
  bottom: ['inset'],
  'column-count': ['column'],
  'column-gap': ['gap'],
  'column-width': ['column'],
  columns: ['column'],
  'flex-flow': ['flex-direction', 'flex-wrap'],
  gap: ['gap'],
  'grid-area': [
    'grid-column-end',
    'grid-column-start',
    'grid-row-end',
    'grid-row-start',
  ],
  'grid-column': ['grid-column-end', 'grid-column-start'],
  'grid-column-gap': ['gap'],
  'grid-gap': ['gap'],
  'grid-row': ['grid-row-end', 'grid-row-start'],
  'grid-row-gap': ['gap'],
  'inline-size': ['width'],
  left: ['inset'],
  'line-height': ['font', 'line-height'],
  'max-block-size': ['max-height'],
  'max-inline-size': ['max-width'],
  'min-block-size': ['min-height'],
  'min-inline-size': ['min-width'],
  'place-content': ['align-content', 'justify-content'],
  'place-items': ['align-items', 'justify-items'],
  'place-self': ['align-self', 'justify-self'],
  right: ['inset'],
  'row-gap': ['gap'],
  top: ['inset'],
}

function rules(asset: string, css: string): readonly Entry[] {
  const ast = CssTree.parse(css, { positions: true })
  const entries: Entry[] = []

  const visit = (list: CssTree.List<CssTree.CssNode>, nested: boolean) => {
    list.forEach((node) => {
      if (node.type === 'Rule') {
        entries.push(entry(asset, node, nested, entries.length))
        return
      }
      if (node.type === 'Atrule' && node.block && conditional.has(node.name))
        visit(node.block.children, true)
    })
  }

  if (ast.type === 'StyleSheet') visit(ast.children, false)
  return entries
}

function entry(
  asset: string,
  rule: CssTree.Rule,
  nested: boolean,
  index: number,
): Entry {
  const classes: string[] = []
  CssTree.walk(rule.prelude, {
    enter(node: CssTree.CssNode) {
      if (node.type === 'ClassSelector') classes.push(node.name)
    },
  })

  const children = rule.block.children.toArray()
  const declarations = children.flatMap((child) =>
    child.type === 'Declaration' ? [child.property.toLowerCase()] : [],
  )
  const name = (() => {
    if (nested || rule.prelude.type !== 'SelectorList') return undefined
    if (rule.prelude.children.size !== 1) return undefined
    const selector = rule.prelude.children.first
    if (selector?.type !== 'Selector' || selector.children.size !== 1)
      return undefined
    const component = selector.children.first
    if (component?.type !== 'ClassSelector') return undefined
    if (!children.length || declarations.length !== children.length)
      return undefined
    return component.name
  })()

  return {
    asset,
    bodyEnd: rule.block.loc!.end.offset,
    bodyStart: rule.block.loc!.start.offset,
    classes,
    declarations,
    end: rule.loc!.end.offset,
    index,
    name,
    start: rule.loc!.start.offset,
  }
}

/**
 * Every string literal and template element whose text is a space-separated list of selected
 * class names, with at most one leading and one trailing space for concatenated pieces.
 */
function lists(
  asset: string,
  code: string,
  selected: ReadonlyMap<string, number>,
): readonly Literal[] {
  const parsed = Parser.parseSync(asset, code, { sourceType: 'unambiguous' })
  if (parsed.errors.length)
    throw new Error(
      `Unable to parse the bundled script ${asset}: ${parsed.errors[0]!.message}`,
    )

  const literals: Literal[] = []
  const collect = (value: string, start: number, end: number) => {
    const tokens = split(value)
    if (!tokens || !tokens.tokens.every((token) => selected.has(token))) return
    literals.push({ asset, end, start, ...tokens })
  }

  const visit = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      for (const item of node) visit(item)
      return
    }

    const record = node as Record<string, unknown>
    const start = record['start']
    const end = record['end']
    if (
      record['type'] === 'Literal' &&
      typeof record['value'] === 'string' &&
      typeof start === 'number' &&
      typeof end === 'number'
    ) {
      // A literal with escapes or an unexpected span is left alone, and its tokens then
      // never match another literal's set, so no rule it names is merged.
      const raw = code.slice(start, end)
      if (raw === `"${record['value']}"` || raw === `'${record['value']}'`)
        collect(record['value'], start + 1, end - 1)
      return
    }
    if (
      record['type'] === 'TemplateElement' &&
      typeof start === 'number' &&
      typeof end === 'number'
    ) {
      const value = record['value'] as {
        readonly cooked?: string
        readonly raw: string
      }
      if (value.cooked === value.raw && code.slice(start, end) === value.raw)
        collect(value.raw, start, end)
      return
    }

    for (const key in record) {
      if (key === 'type' || key === 'start' || key === 'end') continue
      visit(record[key])
    }
  }

  visit(parsed.program)
  return literals
}

function split(value: string) {
  if (!value || /[^\S ]/.test(value)) return undefined
  const leading = value.startsWith(' ')
  const trailing = value.length > 1 && value.endsWith(' ')
  const inner = value.slice(leading ? 1 : 0, trailing ? -1 : undefined)
  if (!inner) return undefined

  const tokens = inner.split(' ')
  if (tokens.some((token) => !token)) return undefined
  return { leading, tokens, trailing }
}

/**
 * Whether moving every later member up to the first changes no cascade. A rule between the first
 * and a later member that could set a longhand of that member would then win or lose differently
 * on an element that carries both, so any such pair keeps the group apart. Specificity is not
 * consulted, so a pseudo-class or descendant rule between counts as well.
 */
function safe(entries: readonly Entry[], members: readonly Entry[]): boolean {
  const first = members[0]!
  const last = members[members.length - 1]!
  const moved = new Set(members.slice(1))

  for (let index = first.index + 1; index < last.index; index++) {
    const between = entries[index]!
    if (moved.has(between) || !between.declarations.length) continue
    for (const member of moved)
      if (member.index > index && conflicts(between, member)) return false
  }

  return true
}

/** Whether a declaration of `a` and one of `b` could set the same longhand. */
function conflicts(a: Entry, b: Entry): boolean {
  return a.declarations.some((left) =>
    b.declarations.some((right) => overlap(left, right)),
  )
}

/**
 * Whether two properties could set the same longhand: the same property, a shorthand and a
 * property it prefixes such as `flex` and `flex-grow`, members of one listed family, or
 * properties that share a listed alias such as `top` and `inset`. Two distinct longhands of one
 * shorthand, such as `font-size` and `font-weight`, do not overlap.
 */
function overlap(a: string, b: string): boolean {
  if (a === b) return true
  if (a.startsWith('--') || b.startsWith('--')) return false

  const left = a.replace(/^-[a-z]+-/, '')
  const right = b.replace(/^-[a-z]+-/, '')
  if (right.startsWith(`${left}-`) || left.startsWith(`${right}-`)) return true

  const head = left.split('-')[0]!
  if (head === right.split('-')[0] && families.has(head)) return true
  return (aliases[left] ?? [left]).some((key) =>
    (aliases[right] ?? [right]).includes(key),
  )
}
