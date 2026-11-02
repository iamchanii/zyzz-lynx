# Lynx Bundle Results

Measurements of the two samples in this directory with `Measure.ts`, recorded on 2026-10-30 on an Apple Silicon macOS host with Rspeedy 0.18.2, Rsbuild 2.2.9, Rspack 2.2.9, `@lynx-js/react` 0.128.0, and `@vanilla-extract/css` 1.21. Sizes are bytes on disk divided by 1024. The headline is `jobPost.lynx.bundle` from a plain production build; the thread scripts and the encoded stylesheet come from the `DEBUG=rspeedy` production build, whose own bundle is larger because the encoder embeds debug information.

## Current Comparison

Workspace zyzz build at `980230d` (the fork's `main`), before the changes on the `lynx-bundle` branch. The Progress Ledger below records each later change, and the final row is the current default.

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

## Progress Ledger

Each row measures the `zyzz` sample after one change on the `lynx-bundle` branch, with the default configuration unless noted. The vanilla-extract sample stays at 247.3 kB.

| Change                                                                     | Commit    | `.lynx.bundle` | Δ        | `main-thread.js` | `background.js` | Encoded CSS | Rules / declarations / classes |
| -------------------------------------------------------------------------- | --------- | -------------- | -------- | ---------------- | --------------- | ----------- | ------------------------------ |
| Baseline, fork `main`                                                      | `980230d` | 291.9 kB       |          | 139.6 kB         | 49.1 kB         | 51.4 kB     | 1177 / 1338 / 1187             |
| Expand `inset` into longhands on Lynx                                      | `01a75f6` | 292.0 kB       | +0.1 kB  | 139.6 kB         | 49.1 kB         | 51.4 kB     | 1177 / 1341 / 1187             |
| Dense graph-wide class names on Lynx                                       | `2829786` | 260.7 kB       | −31.3 kB | 121.3 kB         | 41.6 kB         | 43.7 kB     | 1177 / 1333 / 1187             |
| Compose namespace members declared beside `const` records                  | `6423ed0` | 260.7 kB       | 0        | 121.3 kB         | 41.6 kB         | 43.7 kB     | 1177 / 1333 / 1187             |
| Fold literal `vars()` selections into constant props                       | `4a13a96` | 260.0 kB       | −0.7 kB  | 121.1 kB         | 41.4 kB         | 43.6 kB     | 1174 / 1330 / 1184             |
| Leave out the selector of configurations that only folded selections read  | `05f0f4c` | 257.3 kB       | −2.7 kB  | 119.9 kB         | 40.2 kB         | 43.6 kB     | 1174 / 1330 / 1184             |
| Select recipe and conditional style compositions from class tables         | `44595ed` | 259.2 kB       | +1.9 kB  | 121.4 kB         | 41.5 kB         | 43.2 kB     | 1161 / 1310 / 1171             |
| Same, with `composition: 'independent'` in the sample config (not default) | `44595ed` | 219.0 kB       | −40.2 kB | 120.6 kB         | 40.9 kB         | 30.8 kB     | 667 / 857 / 675                |
| Compose independently by default in the `zyzz/rspeedy` plugin              | `ec8a4ee` | 219.0 kB       | −40.2 kB | 120.6 kB         | 40.9 kB         | 30.8 kB     | 667 / 857 / 675                |

With dense names the main thread is already smaller than the vanilla-extract build (121.4 against 131.4 kB) while the background thread stays 4 kB larger, and the remaining 11.9 kB bundle gap is the rule count (1161 against 503). The scope fold, the selector pruning, and the composition tables together remove every `zyzz/runtime` module from both threads. The tables cost 1.9 kB raw in this sample, since six class tables (the calendar's 32 entries alone hold 4.4 kB of class lists) replace a 2 kB minified runtime per thread, while gzip shrinks by 0.5 kB per thread. Independent composition closes the gap and lands 28.3 kB (11%) under the vanilla-extract bundle, so the `zyzz/rspeedy` plugin now composes independently unless a config or `options.composition` says otherwise. With that default the zyzz sample ships a 219.0 kB bundle against 247.3 kB and 30.8 kB of encoded CSS against 47.6 kB, with 667 rules against 503 and 857 declarations against 1827. A follow-up that would help the default mode is emitting each `cx` argument's rules once in argument order for flat Lynx output instead of one merged copy per combination, which would shrink both the tables and the rule count.

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

A probe application with a generated plain stylesheet and no styled markup shows what the template encoder charges for, measured as `.lynx.bundle` growth over an empty stylesheet (89.6 kB). Every rule in a probe has a distinct declaration block, since Lightning CSS otherwise merges identical rules into one selector list before encoding.

| Stylesheet                                                   | Bundle growth | Per rule |
| ------------------------------------------------------------ | ------------- | -------- |
| 1000 rules, one declaration with a unique value              | 58.8 kB       | 59 B     |
| 1000 rules, three declarations with values from pools of ten | 108.6 kB      | 109 B    |
| 1000 rules, three declarations with unique values            | 106.8 kB      | 107 B    |
| 500 rules, two declarations with unique values               | 41.3 kB       | 83 B     |
| 1000 rules, one unique declaration, 9 character class        | 64.9 kB       | 65 B     |
| 1000 `:active` rules, one unique declaration                 | 84.8 kB       | 85 B     |
| 1000 rules, one `var()` declaration                          | 82.7 kB       | 83 B     |

The encoder charges about 35 bytes per rule, 24 bytes per declaration whether or not its value repeats elsewhere, 1.5 bytes per selector character, 26 bytes per pseudo-class, and 24 bytes more for a `var()` reference. Applied to the samples, the vanilla-extract stylesheet (503 rules, 1827 declarations) costs about 61 kB and the atomic zyzz stylesheet (1177 rules, 1341 declarations) about 73 kB before class-name text, so rule count rather than declaration count separates them. ReactLynx's `extractStr` option, which interns repeated JavaScript strings, changed neither bundle by a byte.

## Independent Composition Experiment

`composition: 'independent'` lets atomic rules share one name across styles whenever their declaration repeats, and keeps conflict order only inside `cx` calls and each style. The sample combines styles only through `cx`, which is the documented condition for the mode.

| Metric                             | ordered (default), atomic | independent, atomic | independent, grouped |
| ---------------------------------- | ------------------------- | ------------------- | -------------------- |
| `.lynx.bundle`                     | 291.9 kB                  | 245.3 kB            | 287.9 kB             |
| `main-thread.js` (raw / gzip)      | 139.6 / 33.8 kB           | 137.8 / 32.8 kB     | 118.1 / 30.4 kB      |
| `background.js` (raw / gzip)       | 49.1 / 14.8 kB            | 47.5 / 14.1 kB      | 39.4 / 13.1 kB       |
| Encoded CSS (raw / gzip)           | 51.4 / 7.8 kB             | 35.6 / 5.8 kB       | 69.4 / 7.9 kB        |
| CSS rules / declarations / classes | 1177 / 1338 / 1187        | 674 / 873 / 682     | 679 / 2332 / 631     |

Independent atomic output halves the rule count and lands 2 kB below the vanilla-extract bundle before any compiler change, with 12 kB less encoded CSS. The mode drops one guarantee: a class passed in through `className` from another module no longer wins over the component's own declarations by definition order.

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
