# Styling with Zyzz

The conventions that the Zyzz documentation treats as standard, condensed for the Lynx sample and for anyone porting a vanilla-extract module. Sources: [Getting Started](https://zyzz.style/docs/introduction/getting-started), [Thinking in Zyzz](https://zyzz.style/docs/introduction/thinking-in-zyzz), [Styling](https://zyzz.style/docs/guides/styling), [Variants](https://zyzz.style/docs/guides/variants), [Themes & Tokens](https://zyzz.style/docs/guides/themes), [Conditions](https://zyzz.style/docs/guides/conditions), [cx](https://zyzz.style/docs/api/core/cx), [Keyframes](https://zyzz.style/docs/guides/keyframes), [Global Styles](https://zyzz.style/docs/guides/global-styles), and the fork's [Rspeedy](../../site/src/content/docs/api/rspeedy.mdx) page. The site serves each page as Markdown at the same URL with a `.md` suffix.

## Principles

- **Co-location over separation:** Component styles live in a module-level `namespace styles` at the bottom of the component file, after the component and its helpers. A separate style module appears only when a second component needs the same definition.
- **Composition over inlining:** Definitions are named after the element or treatment (`card`, `title`, `focusRing`) and combined with `cx`. Two spreads on one element replace each other's `className` and `style`, so one element takes one spread or one `cx` call.
- **Standards over shorthand:** Properties are camelCase CSS, values keep CSS units, and conditions use CSS syntax such as `':active'` and `'@media (max-width: 360px)'`.
- **Explicit configuration:** `style` from `zyzz` is token-free. `style` from the project's `zyzz.config.ts` accepts the token names that config declares, so a renamed token fails type checking at every use.
- **Variants over concatenation:** A fixed set of choices such as size or tone is a `variants` recipe with defaults and compound rules. Callers pass typed selections instead of joining class names.
- **Static rules:** Every rule compiles ahead of time. Calls select existing classes or bind values to precompiled CSS variables, and never create CSS at runtime.

## Config

One config module at the root of the source directory binds the tokens to the exported helpers. Components import the helpers from that module, not from `zyzz`.

```ts
// src/zyzz.config.ts
import { defineConfig, defineVars } from 'zyzz'

const base = defineVars({
  color: {
    bg: { layerDefault: '#ffffff', neutralWeak: '#f3f4f5' },
    fg: { neutral: '#1a1a1a', neutralSubtle: '#868b94' },
  },
  typography: {
    t4Medium: { fontSize: '16px', fontWeight: 500, lineHeight: '22px' },
  },
})

export const { style, variants, vars } = defineConfig({ vars: base })
```

- Nested groups are referenced with dotted names: `color: 'fg.neutral'`, `backgroundColor: 'bg.layerDefault'`.
- A category decides which properties accept its tokens. `color` tokens apply to `color`, `backgroundColor`, and `border*Color`. `typography` presets apply through the `typography` field, and a sibling declaration such as `fontWeight: 700` overrides the preset's field.
- A property constrained by a category still accepts a CSS literal with the ` !custom` suffix, such as `maxWidth: '28rem !custom'`. Properties without configured tokens accept literals directly.
- `vars.color.fg.neutral` is a typed reference for CSS expressions such as `calc()` and `boxShadow` strings. Outside any `vars()` scope, references fall back to the values from `defineVars`, so a Lynx page needs no scope element.
- `cx`, `keyframes`, and `global` are not bound to the config. `cx` comes from `zyzz`, and `keyframes` and `global` come from `zyzz/web`.

## Definitions

```tsx
import { cx } from 'zyzz'
import { keyframes } from 'zyzz/web'
import { style, variants } from '../zyzz.config.js'

export function Chip(props: Chip.Props) {
  return (
    <view {...cx(styles.root(), props.checked && styles.selected())}>
      <text {...cx(styles.label(), props.checked && styles.selectedLabel())}>
        {props.label}
      </text>
    </view>
  )
}

const enter = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })

namespace styles {
  const row = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  } as const

  export const root = style({
    ...row,
    animationDuration: '160ms',
    animationName: enter,
    backgroundColor: 'bg.layerDefault',
    ':active': { backgroundColor: 'bg.neutralWeak' },
    '@media (max-width: 360px)': { height: '32px' },
  })

  export const selected = style({ backgroundColor: 'fg.neutral' })

  export const label = style({ color: 'fg.neutral', typography: 't4Medium' })

  export const selectedLabel = style({ color: 'bg.layerDefault' })

  export const primary = style([root, selected, { borderRadius: '6px' }])
}
```

- **Apply:** Call the definition during render and spread the result: `<view {...styles.root()}>`. The call returns `className`, and `style` when values are bound.
- **Combine:** `cx(a(), condition && b())` merges applied styles in argument order, so later conflicts win. `false`, `null`, and `undefined` skip an argument. Ternaries, mutated bindings, and more than eight conditional arguments fail compilation. A definition read as a value, such as `[a, b][index]`, stays a runtime function and cannot join a `cx` call.
- **Compose:** `style([base, other, { overrides }])` copies the declarations of earlier definitions into one new definition, in order. The result applies alone, without `cx`. Entries are static definitions or immutable records. Variants and dynamic definitions compose with `cx` instead.
- **Reuse declarations:** A local `as const` record spreads into several definitions and the compiler copies the declarations in place. Keep such records inside the namespace or at module scope of the same file.
- **Conditions:** Nest pseudo-classes, at-rules, and attribute selectors in the declaration object. `&` stands for the styled element. Another definition interpolates into a selector without being called, such as ``[`${styles.row}:active &`]`` under `selectors`.
- **Dynamic values:** `style((values: { width: `\${number}%` }) => ({ width: values.width }))` binds per-instance values to precompiled variables. Each input needs an explicit finite scalar type.
- **Variables:** `variable('color')` declares a typed CSS variable that styles read as a value and assign through `vars`, statically in a definition or inline at an application.

## Variants

```tsx
export function ActionButton(props: ActionButton.Props) {
  return (
    <view className={styles.button({ size: props.size, tone: props.tone })}>
      <text className={styles.label({ tone: props.tone })}>{props.label}</text>
    </view>
  )
}

export declare namespace ActionButton {
  type Props = Pick<Props.Variants<typeof styles.button>, 'size' | 'tone'> & {
    label: string
  }
}

namespace styles {
  export const button = variants({
    base: { borderRadius: '6px', display: 'flex' },
    compoundVariants: [
      { when: { size: 'large', tone: 'brand' }, style: { fontWeight: 700 } },
    ],
    defaultVariants: { size: 'medium' },
    selection: 'className',
    variants: {
      size: { large: { minHeight: '52px' }, medium: { minHeight: '44px' } },
      tone: {
        brand: { backgroundColor: 'bg.brandSolid' },
        neutral: { backgroundColor: 'bg.neutralWeak' },
      },
    },
  })
}
```

- `base` holds declarations shared by every choice. Each call selects at most one choice per axis. An omitted selection uses the default, and `null` suppresses an axis.
- `compoundVariants` entries match when every axis in `when` matches. Precedence is `base`, then axes in declaration order, then compounds in array order.
- `Props.Variants<typeof recipe>` derives the component's selection props. Behavior props such as `disabled` stay on the element.
- On Lynx, recipes select with classes. `selection: 'className'` returns the class list for a `className` prop and accepts only selections and a `className` override. The default class selection returns `className` and `style` props for a spread, and combines with other styles through `cx`.

## Lynx Target

The `zyzz/rspeedy` plugin compiles every environment for the `lynx` target, because the template encoder keeps only flat class rules.

- `selection: 'attribute'`, recipe `conditions`, `:first-child`, `:has()`, `::before`, `@container`, `@layer`, `@supports`, and the `~=` attribute matcher are compile errors. `:active`, `:focus`, `:hover`, `:not()`, `:root`, `::placeholder`, `::selection`, other attribute selectors, and `@media` compile to flat rules.
- Nested conditions flatten: `&` becomes the style's class, and a query wraps the class rule.
- Lengths accept the Lynx `rpx` and `sp` units.
- Lynx encodes `var(--x)` references as `{{--x}}` and keeps custom property declarations in a rule's `variables` map rather than its `style` list. Both are visible in a development build's `dist/.lynx/<entry>/tasm.json`.
- The default output is atomic, one rule per declaration, so an element's class list grows with its declaration count. `defineConfig({ output: 'grouped' })` emits one rule per definition instead. The [CSS Output](https://zyzz.style/docs/guides/css-output) guide covers the trade-off.

## Porting from vanilla-extract

| vanilla-extract                                                     | Zyzz                                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `X.css.ts` beside `X.tsx`, `import * as styles`                     | `namespace styles` at the bottom of `X.tsx`                                                                              |
| `export const root = style({...})`                                  | `export const root = style({...})` inside the namespace                                                                  |
| `style([base, { ... }])`                                            | `style([base, { ... }])`, same semantics                                                                                 |
| `className={styles.root}`                                           | `{...styles.root()}`                                                                                                     |
| ``className={`${a} ${c ? b : ''}`}``                                | `{...cx(styles.a(), c && styles.b())}`                                                                                   |
| `styleVariants({ large: {...}, medium: {...} })` + `styles.size[x]` | `variants({ selection: 'className', variants: { size: {...} } })` + `className={styles.button({ size })}`                |
| `keyframes({...})` from `@vanilla-extract/css`                      | `keyframes({...})` from `zyzz/web`, at module scope                                                                      |
| `globalStyle(`\${cls} text`, {...})`                                | `global({ [`\${styles.cls} text`]: {...} })` from `zyzz/web`, or a `selectors` entry `'& text'` on the parent definition |
| `vars.color.fg.neutral` holding `var(--seed-...)`                   | token name `'fg.neutral'` with `style` from `zyzz.config.ts`                                                             |
| `...typography.t4Medium` spread                                     | `typography: 't4Medium'` preset, or a local `as const` record spread                                                     |
| `tokens.css` with `page { --seed-...: ... }`                        | `defineVars` values in `zyzz.config.ts`, emitted by the compiler                                                         |
| `'@media': { '(max-width: 360px)': {...} }`                         | `'@media (max-width: 360px)': {...}`                                                                                     |
| `':active': {...}`                                                  | `':active': {...}`                                                                                                       |
