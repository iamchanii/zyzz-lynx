/**
 * Expands `inset` shorthands back into their physical longhands for the Lynx target.
 *
 * Lightning CSS merges `top`, `right`, `bottom`, and `left` declarations of one rule into `inset`
 * whenever all four are present, without a compatibility check, and the Lynx template encoder
 * drops `inset` as an unsupported property. The host runs this pass over the final stylesheet,
 * after the last Lightning CSS transform, and edits only the declaration spans so the rest of the
 * text and its source map positions stay in place.
 * @module
 */
import * as CssTree from 'css-tree'

/** Replaces every `inset` declaration in `code` with the four longhands it stands for. */
export function expand(code: string): string {
  if (!code.includes('inset')) return code

  const ast = CssTree.parse(code, { positions: true })
  const edits: expand.Edit[] = []

  CssTree.walk(ast, {
    enter(node) {
      if (node.type !== 'Declaration' || node.property !== 'inset' || !node.loc)
        return
      if (node.value.type !== 'Value') return

      const values = node.value.children
        .toArray()
        .filter((child) => child.type !== 'WhiteSpace')
        .map((child) => CssTree.generate(child))
      const sides = longhands(values)
      if (!sides) return

      const important = node.important ? ' !important' : ''
      edits.push({
        end: node.loc.end.offset,
        start: node.loc.start.offset,
        text: sides
          .map(([property, value]) => `${property}:${value}${important}`)
          .join(';'),
      })
    },
    visit: 'Declaration',
  })

  let output = code
  for (const edit of edits.reverse())
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end)

  return output
}

export declare namespace expand {
  type Edit = {
    readonly end: number
    readonly start: number
    readonly text: string
  }
}

/** Distributes one to four shorthand values over the sides in CSS order. */
function longhands(
  values: readonly string[],
): readonly (readonly [string, string])[] | undefined {
  const [first, second, third, fourth] = values
  if (first === undefined || values.length > 4) return undefined

  const top = first
  const right = second ?? first
  const bottom = third ?? first
  const left = fourth ?? right

  return [
    ['top', top],
    ['right', right],
    ['bottom', bottom],
    ['left', left],
  ]
}
