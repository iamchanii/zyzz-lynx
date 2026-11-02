# Lynx Bundle Results

Measurements of the two samples in this directory with `Measure.ts`, recorded on 2026-10-30 on an Apple Silicon macOS host with Rspeedy 0.18.2, Rsbuild 2.2.9, Rspack 2.2.9, `@lynx-js/react` 0.128.0, and `@vanilla-extract/css` 1.21. Sizes are bytes on disk divided by 1024. The headline is `jobPost.lynx.bundle` from a plain production build; the thread scripts and the encoded stylesheet come from the `DEBUG=rspeedy` production build, whose own bundle is larger because the encoder embeds debug information.

## Current Comparison

Workspace zyzz build at `980230d` (the fork's `main`).

| Metric                             | vanilla-extract        | zyzz                   |
| ---------------------------------- | ---------------------- | ---------------------- |
| `.lynx.bundle`                     | 247.3 kB               | 291.9 kB               |
| External chunks (raw / gzip / br)  | 54.8 / 20.6 / 18.7 kB  | 54.8 / 20.6 / 18.7 kB  |
| `main-thread.js` (raw / gzip / br) | 131.4 / 29.0 / 24.5 kB | 139.6 / 33.8 / 28.4 kB |
| `background.js` (raw / gzip / br)  | 37.3 / 12.3 / 10.4 kB  | 49.1 / 14.8 / 12.2 kB  |
| Encoded CSS (raw / gzip / br)      | 47.6 / 6.4 / 5.8 kB    | 51.4 / 7.8 / 6.5 kB    |
| CSS rules / declarations / classes | 503 / 1827 / 462       | 1177 / 1338 / 1187     |
| CSS `@media` / `@keyframes`        | 3 / 11                 | 4 / 11                 |

The external chunks are the same ReactLynx runtime in both builds. The zyzz bundle is 44.6 kB larger, and three sources account for it:

- **Class-name text:** the bundle holds 4709 occurrences of generated class names, 48.2 kB of text, against 1239 occurrences and 10.7 kB in the vanilla-extract bundle. Atomic output gives each element one class per declaration, and every production name carries a six-character module qualifier (`z_5u3RWX0`). The main thread alone holds 2854 class tokens (26.9 kB) and the background thread 1166 (11.2 kB).
- **Runtime modules:** `runtime/Composition.js`, `runtime/Selection.js`, `runtime/Props.js`, `runtime/Html.js`, `runtime/index.js`, and `internal/Scheme.js` ship in both thread layers, about 15 kB of source per layer before minification. The vanilla-extract build ships no styling runtime.
- **Rule count:** 1177 flat rules against 503. Each rule costs selector text and encoder overhead, although the atomic output has fewer declarations in total.

## Grouped Output Experiment

`defineConfig({ cssOutput: 'grouped', vars: base })` with the same sources:

| Metric                             | atomic (default)   | grouped          |
| ---------------------------------- | ------------------ | ---------------- |
| `.lynx.bundle`                     | 291.9 kB           | 291.0 kB         |
| `main-thread.js` (raw / gzip)      | 139.6 / 33.8 kB    | 116.5 / 30.2 kB  |
| `background.js` (raw / gzip)       | 49.1 / 14.8 kB     | 39.4 / 13.1 kB   |
| Encoded CSS (raw / gzip)           | 51.4 / 7.8 kB      | 72.3 / 7.9 kB    |
| CSS rules / declarations / classes | 1177 / 1338 / 1187 | 661 / 2436 / 612 |

Grouped output makes both thread scripts smaller than the vanilla-extract build, because each element carries one class per definition, but every `cx` combination becomes a merged rule that repeats the declarations of its inputs, so the stylesheet grows by 1100 declarations and the bundle ends where it started.

## Encoder Cost Model

A probe application with a generated plain stylesheet and no styled markup shows what the template encoder charges for, measured as `.lynx.bundle` growth over an empty stylesheet (89.6 kB):

| Stylesheet                                              | Bundle growth | Per rule |
| ------------------------------------------------------- | ------------- | -------- |
| 1000 rules, one repeated declaration, 4 to 5 char class | 23.4 kB       | 24 B     |
| 1000 rules, one repeated declaration, 9 char class      | 29.3 kB       | 30 B     |
| 250 rules, four repeated declarations                   | 5.9 kB        | 24 B     |
| 1000 rules, four repeated declarations                  | 23.5 kB       | 24 B     |
| 1000 rules, one `var()` declaration                     | 23.4 kB       | 24 B     |
| 1000 rules, one declaration with a unique value         | 57.4 kB       | 59 B     |
| 1000 `:active` rules, one repeated declaration          | 48.8 kB       | 50 B     |

The encoder interns repeated declarations, so a declaration that already appears in another rule costs nothing, while every rule costs about 24 bytes plus 1.5 bytes per selector character, a unique value about 35 bytes, and a pseudo-class about 26 bytes. Rule count and class-name length therefore decide the stylesheet's share of the bundle, and grouped output's repeated declarations are nearly free. ReactLynx's `extractStr` option, which interns repeated JavaScript strings, changed neither bundle by a byte here.

## Commit Checkpoints

The `zyzz` sample measured against worktrees of this repository. The fork's base commit is `1fa9ece`, the last Rspeedy plugin commit before the compiler changes. Each later row adds one compiler commit on top of the previous one, and version-bump and documentation commits are left out.

| Commit    | Change                                                    | `.lynx.bundle` | `main-thread.js` raw / gzip | `background.js` raw / gzip | Encoded CSS raw / gzip | Rules / declarations / classes                                                                                                                                                                                                                         |
| --------- | --------------------------------------------------------- | -------------- | --------------------------- | -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `1fa9ece` | Rspeedy plugin base                                       | build fails    |                             |                            |                        | `selection: 'className'` does not exist, so recipes report `Recipe selection must be 'attribute' or 'class'`, and a private `const` record inside `namespace styles` fails `cx` with `Composition requires statically known local style applications`. |
| `8d3d17e` | Flat class rules for recipes, `selection: 'className'`    | build fails    |                             |                            |                        | Two modules declare `keyframes` named `enter`, and rule names are not yet module-qualified: `Conflicting animation identity: z-k-enter`.                                                                                                               |
| `7f6d720` | Module-qualified binding-derived rule names               | 389.5 kB       | 187.4 / 41.4 kB             | 94.0 / 24.5 kB             | 54.1 / 8.1 kB          | 1264 / 1411 / 1273                                                                                                                                                                                                                                     |
| `4b3807e` | Lynx `rpx` and `sp` units                                 | 389.5 kB       | 187.4 / 41.4 kB             | 94.0 / 24.5 kB             | 54.1 / 8.1 kB          | 1264 / 1411 / 1273                                                                                                                                                                                                                                     |
| `491443d` | Numeric strings for number and ratio properties           | 389.5 kB       | 187.4 / 41.4 kB             | 94.0 / 24.5 kB             | 54.1 / 8.1 kB          | 1264 / 1411 / 1273                                                                                                                                                                                                                                     |
| `dc986ff` | Array-index choice names under class selection            | 389.5 kB       | 187.4 / 41.4 kB             | 94.0 / 24.5 kB             | 54.1 / 8.1 kB          | 1264 / 1411 / 1273                                                                                                                                                                                                                                     |
| `8cc2ece` | Fold local namespace applications outside import cycles   | 297.5 kB       | 139.8 / 33.8 kB             | 49.3 / 14.8 kB             | 54.1 / 8.1 kB          | 1264 / 1411 / 1273                                                                                                                                                                                                                                     |
| `d1ed6d1` | Keep `cx` composition when definitions are read as values | 297.5 kB       | 139.8 / 33.8 kB             | 49.3 / 14.8 kB             | 54.1 / 8.1 kB          | 1264 / 1411 / 1273                                                                                                                                                                                                                                     |
| `5b317a3` | Nested conditions as flat rules on the Lynx target        | 299.5 kB       | 139.8 / 33.8 kB             | 49.3 / 14.8 kB             | 54.9 / 8.2 kB          | 1263 / 1429 / 1273                                                                                                                                                                                                                                     |
| `23fd0f5` | Leave out rules of styles applied only inside `cx` calls  | 291.9 kB       | 139.6 / 33.8 kB             | 49.1 / 14.8 kB             | 51.4 / 7.8 kB          | 1177 / 1338 / 1187                                                                                                                                                                                                                                     |

Folding namespace applications (`8cc2ece`) removed 92 kB, almost a quarter of the bundle, by replacing runtime `style()` calls and their class tables in both threads with constant `className` strings. Leaving out `cx`-only rules (`23fd0f5`) removed 7.6 kB and 87 rules. The unit, numeric-string, and array-index commits widen what compiles without changing this sample's output. Flat nested conditions (`5b317a3`) add 2 kB, since each nested `:active` rule under a `cx` group now prints once per group.

## Porting Findings

Compiler behavior recorded while porting the sample, each a candidate fix or a documentation note:

- **`inset` folding on Lynx (fixed in `01a75f6`):** four `top`, `right`, `bottom`, `left: 0` longhands folded into one `inset: 0` rule, because Lightning CSS merges the four sides of a rule unconditionally during the host's final stylesheet pass, and the Lynx encoder dropped `inset` as unsupported, so five elements lost their offsets. The `zyzz/rspeedy` host now expands `inset` back into its longhands for the lynx target, which adds 0.1 kB for the three extra declarations.
- **Private records inside `namespace styles`:** a non-exported `const row = { ... } as const` inside the namespace makes every `cx` call over that namespace fail with `Composition requires statically known local style applications`. Moving the record to module scope compiles. The error points at the first `cx` argument, not at the record.
- **Theme data spreads:** `defineVars` rejects spreads in typography presets (`Theme data requires explicit properties without spreads, methods, or computed keys`), so presets repeat their scale values.
- **Template literal expressions:** `` width: `${100 / 7}%` `` is rejected (`Expected a literal string or number; expressions are not evaluated`) and needs the computed literal.
- **`vars()` scope:** the compiler emits `var(--z-…, fallback)` references, but the Lynx encoder keeps only the `{{--z-…}}` reference, so the root element must carry the `z-theme-theme` class through `vars({})` for tokens to resolve. `colorScheme` produces three `color-scheme` encoder warnings on Lynx.
- **Type declaration for `zyzz.css`:** TypeScript needs an ambient `declare module 'zyzz.css'` for the side-effect import.
