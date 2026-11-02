# Lynx Bundle Results

Measurements of the two samples in this directory with `Measure.ts`, recorded on 2026-10-30 on an Apple Silicon macOS host with Rspeedy 0.18.2, Rsbuild 2.2.9, Rspack 2.2.9, `@lynx-js/react` 0.128.0, and `@vanilla-extract/css` 1.21. Sizes are bytes on disk divided by 1024. The headline is `jobPost.lynx.bundle` from a plain production build; the thread scripts and the encoded stylesheet come from the `DEBUG=rspeedy` production build, whose own bundle is larger because the encoder embeds debug information.

## Current Comparison

Workspace zyzz build at `980230d` (the fork's `main`), before the changes on the `lynx-bundle` branch. The Progress Ledger below records each later change, and its final row is the current default: 194.1 kB against 247.3 kB, with 22.9 kB of encoded CSS against 47.6 kB.

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

| Change                                                                                | Commit    | `.lynx.bundle` | Δ        | `main-thread.js` | `background.js` | Encoded CSS | Rules / declarations / classes |
| ------------------------------------------------------------------------------------- | --------- | -------------- | -------- | ---------------- | --------------- | ----------- | ------------------------------ |
| Baseline, fork `main`                                                                 | `980230d` | 291.9 kB       |          | 139.6 kB         | 49.1 kB         | 51.4 kB     | 1177 / 1338 / 1187             |
| Expand `inset` into longhands on Lynx                                                 | `01a75f6` | 292.0 kB       | +0.1 kB  | 139.6 kB         | 49.1 kB         | 51.4 kB     | 1177 / 1341 / 1187             |
| Dense graph-wide class names on Lynx                                                  | `2829786` | 260.7 kB       | −31.3 kB | 121.3 kB         | 41.6 kB         | 43.7 kB     | 1177 / 1333 / 1187             |
| Compose namespace members declared beside `const` records                             | `6423ed0` | 260.7 kB       | 0        | 121.3 kB         | 41.6 kB         | 43.7 kB     | 1177 / 1333 / 1187             |
| Fold literal `vars()` selections into constant props                                  | `4a13a96` | 260.0 kB       | −0.7 kB  | 121.1 kB         | 41.4 kB         | 43.6 kB     | 1174 / 1330 / 1184             |
| Leave out the selector of configurations that only folded selections read             | `05f0f4c` | 257.3 kB       | −2.7 kB  | 119.9 kB         | 40.2 kB         | 43.6 kB     | 1174 / 1330 / 1184             |
| Select recipe and conditional style compositions from class tables                    | `44595ed` | 259.2 kB       | +1.9 kB  | 121.4 kB         | 41.5 kB         | 43.2 kB     | 1161 / 1310 / 1171             |
| Same, with `composition: 'independent'` in the sample config (not default)            | `44595ed` | 219.0 kB       | −40.2 kB | 120.6 kB         | 40.9 kB         | 30.8 kB     | 667 / 857 / 675                |
| Compose independently by default in the `zyzz/rspeedy` plugin                         | `ec8a4ee` | 219.0 kB       | −40.2 kB | 120.6 kB         | 40.9 kB         | 30.8 kB     | 667 / 857 / 675                |
| Share recipe base declarations as units under independent composition                 | `8f14e0d` | 211.4 kB       | −7.6 kB  | 118.6 kB         | 38.8 kB         | 29.7 kB     | 613 / 818 / 621                |
| Concatenate flat Lynx compositions with override copies                               | `2f027bd` | 195.4 kB       | −16.0 kB | 115.4 kB         | 35.6 kB         | 23.0 kB     | 507 / 570 / 512                |
| Share override copies across a module's compositions and copy only selectable choices | `904924f` | 195.2 kB       | −0.2 kB  | 115.4 kB         | 35.6 kB         | 22.9 kB     | 506 / 569 / 509                |
| Read recipe axes directly and coerce only boolean-like and numeric choices            | `1a457bf` | 194.1 kB       | −1.1 kB  | 114.7 kB         | 35.0 kB         | 22.9 kB     | 506 / 569 / 509                |

With dense names the main thread is already smaller than the vanilla-extract build (121.4 against 131.4 kB) while the background thread stays 4 kB larger, and the remaining 11.9 kB bundle gap is the rule count (1161 against 503). The scope fold, the selector pruning, and the composition tables together remove every `zyzz/runtime` module from both threads. The tables cost 1.9 kB raw in this sample, since six class tables (the calendar's 32 entries alone hold 4.4 kB of class lists) replace a 2 kB minified runtime per thread, while gzip shrinks by 0.5 kB per thread. Independent composition closes the gap and lands 28.3 kB (11%) under the vanilla-extract bundle, so the `zyzz/rspeedy` plugin now composes independently unless a config or `options.composition` says otherwise. This default was chosen in the optimization loop on the grounds that Lynx elements combine styles only through `cx`, which keeps its argument order; the one guarantee it gives up is that a class passed in through `className` from another module wins by definition order, and `options.composition: 'ordered'` restores it. With that default the zyzz sample ships a 219.0 kB bundle against 247.3 kB and 30.8 kB of encoded CSS against 47.6 kB, with 667 rules against 503 and 857 declarations against 1827.

## Independent Composition Follow-Ups

The 219.0 kB default build still carried two kinds of repeated output. Its twelve class tables held 140 entries, 6.3 kB of class lists in each thread, and the encoded stylesheet held 643 style rules over 435 distinct declaration bodies, so 208 rules repeated a body that another rule already carried. 124 of those were the per-combination copies that the tables select from, and 84 came from `variants` recipes: `atoms()` named a recipe's base declarations with module-qualified identities, which never met the `namespace\nbody` keys that `unit()` shares between plain styles, so a base such as `alignItems: 'center'` printed as `.zcq { align-items: center }` beside the shared `.z9`.

`8f14e0d` routes a Lynx recipe base through the shared-unit path and prints its choice and compound class rules after the units, so a choice still overrides the base. This removes 54 rules and 7.6 kB of bundle, with no change to web, ordered, grouped, or development output. The remaining repeats are the table copies, the recipe choice classes themselves (a choice adds one class per callable, so sharing them needs a different recipe runtime shape), and styles with descendant selectors such as `& text`, which flat output keeps whole.

`2f027bd` replaces the tables for `cx` calls whose arguments are local styles and class-selection recipes. Each argument emits its own rules once, the class list is a concatenation of constant strings, conditional strings behind their conditions, and recipe selectors, and a declaration that conflicts with an earlier argument's under the same condition prints one copy under a class of the call after every shared unit, so argument order still decides the cascade. Both threads now hold zero class tables and no composition runtime, and the stylesheet drops to 530 style rules over 433 distinct bodies, with 97 repeats left: the override copies, the recipe choice classes, and styles with descendant selectors. The bundle lands at 195.4 kB, 51.9 kB (21%) under the vanilla-extract sample, with 23.0 kB of encoded CSS against 47.6 kB and 507 rules against 503 at 570 declarations against 1827. The copies are deduplicated only within one argument, since sharing a copy between arguments such as `a(red)`, `b(green)`, `c(red)` would reorder the cascade, and a recipe applied with a literal choice still emits a copy for every conflicting choice.

`904924f` lifts both limits. The copy pool is one per module, and an argument reuses an identical copy from an earlier argument or a sibling call when that copy's index is above every copy of an earlier argument of the same call that conflicts with it under the same conditions, so `a(blue), b(red), c(green), d(red)` still gives `d` a fresh copy while `b` and a sibling call's `e(red)` share one. A recipe applied with literal choices copies only the choices it can select, and a later argument conflicts only with those. The sample moves 0.2 kB and one rule, since Lightning CSS had already merged the identical sibling copies into one selector list and the sample holds no unselectable literal-choice copies: the three `Divider` copies the earlier analysis counted as such come from three conditional plain styles whose exclusivity the compiler cannot prove. The 96 repeated bodies that remain split into recipe choice classes that repeat shared units (26 groups), styles with descendant selectors or nested rules whose every declaration prints as a module-private atom because `flatten` treats the whole style as opaque (14 groups of plain units and 5 with descendants), copies that conflicts require (12), identical copies in different modules, and keyframe steps.

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

The fork's commits since the upstream base `4386bf4` fall into three groups. The Rspeedy support base, kept as the starting point, is the plugin and host work that compiles nothing differently: `49a5259` (the fork and the `zyzz/rspeedy` plugin), `4a6753f` (watch recovery after a `buildStart` error), `b733ce0` (transform before `enforce: 'pre'` loaders), and `1fa9ece` (stylesheet module out of split chunks), with `cc374fc` (`inject` option) and `99371fe` (docs) arriving later in history and changing no output. The compiler commits applied one at a time on that base are `8d3d17e`, `7f6d720`, `4b3807e`, `491443d`, `dc986ff`, `8cc2ece`, `d1ed6d1`, `5b317a3`, and `23fd0f5`. The version bumps `4bf0edc`, `7bd5383`, and `980230d` and the workflow commit `ebda723` are left out. The history is linear, so a worktree at each compiler commit equals the base plus every compiler commit up to it, and the `zyzz` sample measured against each worktree gives the rows below.

| Commit    | Change                                                    | `.lynx.bundle` | `main-thread.js` raw / gzip | `background.js` raw / gzip | Encoded CSS raw / gzip | Rules / declarations / classes                                                                                                                                                                                                                         |
| --------- | --------------------------------------------------------- | -------------- | --------------------------- | -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `49a5259` | Fork with the `zyzz/rspeedy` plugin                       | build fails    |                             |                            |                        | Same errors as `1fa9ece`: `selection: 'className'` does not exist and a private record inside `namespace styles` fails `cx`.                                                                                                                           |
| `4a6753f` | Watch builds survive a `buildStart` error                 | build fails    |                             |                            |                        | Same errors as `1fa9ece`: `selection: 'className'` does not exist and a private record inside `namespace styles` fails `cx`.                                                                                                                           |
| `b733ce0` | Transform before `enforce: 'pre'` loaders                 | build fails    |                             |                            |                        | Same errors as `1fa9ece`: `selection: 'className'` does not exist and a private record inside `namespace styles` fails `cx`.                                                                                                                           |
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

## Branch Checkpoints

The `zyzz` sample measured against a worktree of each `lynx-bundle` compiler commit in turn, prepared and measured the same way as the fork checkpoints above, so every row stands on its own build rather than on the branch head. Each row contains the commits above it.

| Commit    | Change                                                                                | `.lynx.bundle` | `main-thread.js` raw / gzip | `background.js` raw / gzip | Encoded CSS raw / gzip | Rules / declarations / classes |
| --------- | ------------------------------------------------------------------------------------- | -------------- | --------------------------- | -------------------------- | ---------------------- | ------------------------------ |
| `01a75f6` | Expand `inset` into longhands on Lynx                                                 | 292.0 kB       | 139.6 / 33.8 kB             | 49.1 / 14.8 kB             | 51.4 / 7.8 kB          | 1177 / 1341 / 1187             |
| `2829786` | Dense graph-wide class names on Lynx                                                  | 260.7 kB       | 121.3 / 32.8 kB             | 41.6 / 14.5 kB             | 43.7 / 7.0 kB          | 1177 / 1333 / 1187             |
| `6423ed0` | Compose namespace members declared beside `const` records                             | 260.7 kB       | 121.3 / 32.8 kB             | 41.6 / 14.5 kB             | 43.7 / 7.0 kB          | 1177 / 1333 / 1187             |
| `4a13a96` | Fold literal `vars()` selections into constant props                                  | 260.0 kB       | 121.1 / 32.9 kB             | 41.4 / 14.4 kB             | 43.6 / 7.0 kB          | 1174 / 1330 / 1184             |
| `05f0f4c` | Leave out the selector of configurations only folded selections read                  | 257.3 kB       | 119.9 / 32.5 kB             | 40.2 / 13.9 kB             | 43.6 / 7.0 kB          | 1174 / 1330 / 1184             |
| `44595ed` | Select recipe and conditional style compositions from class tables                    | 259.2 kB       | 121.4 / 32.0 kB             | 41.5 / 13.4 kB             | 43.2 / 6.9 kB          | 1161 / 1310 / 1171             |
| `ec8a4ee` | Compose definitions independently by default on Lynx                                  | 219.0 kB       | 120.6 / 31.0 kB             | 40.9 / 12.5 kB             | 30.8 / 5.2 kB          | 667 / 857 / 675                |
| `8f14e0d` | Share recipe base declarations as units under independent composition                 | 211.4 kB       | 118.6 / 30.7 kB             | 38.8 / 12.4 kB             | 29.7 / 4.9 kB          | 613 / 818 / 621                |
| `2f027bd` | Concatenate flat Lynx compositions with override copies                               | 195.4 kB       | 115.4 / 30.1 kB             | 35.6 / 11.9 kB             | 23.0 / 4.5 kB          | 507 / 570 / 512                |
| `904924f` | Share override copies across a module's compositions and copy only selectable choices | 195.2 kB       | 115.4 / 30.1 kB             | 35.6 / 11.9 kB             | 22.9 / 4.5 kB          | 506 / 569 / 509                |
| `1a457bf` | Read recipe axes directly and coerce only boolean-like and numeric choices            | 194.1 kB       | 114.7 / 30.0 kB             | 35.0 / 11.8 kB             | 22.9 / 4.5 kB          | 506 / 569 / 509                |

The vanilla-extract sample measures 247.3 kB, 131.4 / 29.0 kB, 37.3 / 12.3 kB, and 47.6 / 6.4 kB with 503 / 1827 / 462 throughout.

## Compressed Size Analysis

Recorded on 2026-11-02 at `904924f`. Three analyses attributed the compressed bundle by re-encoding `tasm.json` sections with the `@lynx-js/tasm` encoder and by rewriting the thread sources and CSS before re-encoding, all with `node:zlib` gzip level 9 and default Brotli.

| Section                        | vanilla-extract gzip / br | Zyzz gzip / br | Δ gzip / br    |
| ------------------------------ | ------------------------- | -------------- | -------------- |
| Main thread (LepusNG bytecode) | 42.6 / 35.0 kB            | 42.1 / 35.4 kB | −0.5 / +0.5 kB |
| Encoded CSS                    | 8.2 / 6.7 kB              | 6.7 / 5.3 kB   | −1.5 / −1.4 kB |
| Background thread (source)     | 12.4 / 10.4 kB            | 12.0 / 9.9 kB  | −0.4 / −0.5 kB |
| Header and config              | 0.5 / 0.5 kB              | 0.5 / 0.5 kB   | 0              |

The main thread ships as QuickJS bytecode, which compresses about 12 kB worse than its source in both builds and is nearly equal between them, so it is a shared floor rather than a Zyzz cost. The whole compressed advantage comes from the stylesheet and the background thread. Class-list literals are about 8% of the Zyzz bundle's gzip size, and source-level savings in them survive the bytecode almost entirely (85–100% in re-encoding tests), while renaming experiments (frequency order, first-use order, fixed width, sorted lists, hoisted constants) all moved the bundle by 0.3 kB or less, so the names are at their floor and the remaining lever is the number of tokens per element. Rule emission order does not change the bundle at all, since the encoder restructures rules.

Measured levers, each by re-encoding the sample with the change applied by hand:

| Lever                                                                                                                                                      | Δ gzip / br             | Status                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| Merge units whose usage sets are identical across the graph (212 classes → 77)                                                                             | −0.89 / −0.44 kB        | Planned last, needs a graph-wide pass                                  |
| Dense token custom property names on Lynx                                                                                                                  | −0.83 / −0.61 kB        | Planned                                                                |
| Omit `var()` fallbacks on Lynx                                                                                                                             | −0.55 / −0.51 kB        | Planned                                                                |
| Simplify recipe callable guards                                                                                                                            | −0.12 / −0.11 kB        | Landed as `1a457bf`: bundle gzip 60.9 → 60.7 kB, brotli 50.8 → 50.8 kB |
| Dense keyframe names on Lynx                                                                                                                               | −0.11 / −0.07 kB        | Planned                                                                |
| All five together (measured)                                                                                                                               | −2.40 / −1.63 kB        |                                                                        |
| Also drop the encoder's `defaultValueMap` keys                                                                                                             | −0.49 / −0.29 kB        | Deferred: needs a template plugin hook, native semantics unverified    |
| `chunkSplit: 'all-in-one'`                                                                                                                                 | −6.8 / −5.9 kB transfer | App configuration, same for both samples, loses shared chunk caching   |
| One class per element (grouped output)                                                                                                                     | −2.2 kB gzip in JS      | Rejected: the stylesheet grows by 1100 declarations                    |
| Dropping the `z` prefix, name reordering, in-list sorting, constant hoisting, selector-list merging, `extractStr`, `compress.passes`, CSS selector toggles | ≤ 0.3 kB or worse       | Rejected                                                               |

## Visual Comparison

`visual/Compare.ts` renders both samples' web bundles (`lynx.web.config.ts` in each sample, built with `rspeedy build -c lynx.web.config.ts`) through `@lynx-js/web-core` in headless Chromium at 390×844 CSS px and device scale factor 2, drives both through the same eleven states, and compares the screenshots with `pixelmatch` at threshold 0.1 with anti-aliasing excluded. The states are the loading skeleton, the ready screen with the notification nudge, the nudge dismissed, the snackbar after saving an interest, the snackbar closed through its action after removing the interest, the scrolled screen with the solid app bar, the calendar opened, the description expanded, the bottom of the screen, the error screen after the call button, and the recovered screen after retry. Screenshots, diff images, and a summary land in `bench/results/lynx/visual/`.

Recorded on 2026-11-02 at `904924f` with the Chromium that Playwright 1.63 installs: eight states are pixel-identical, and the three states after the calendar opens differ in 499, 327, and 1167 of 1,316,160 pixels (at most 0.09%). The loading and ready states are informational, since the skeleton shimmer and the nudge countdown bar move while the screenshot is taken, and they came out identical in the recorded run.

The three differences have one cause. The calendar cell is authored as `width: '14.285714285714286%'` with `aspectRatio: '1'`. The vanilla-extract build keeps that text, and the Zyzz build prints `14.2857%`, because the compiler prints declarations through Lightning CSS, whose `cssparser` serializer writes numbers with six significant digits. At a 378 px row the cell is 54 px against 53.984375 px (Chromium's 1/64 px layout unit), so the open calendar is 229.953 px tall instead of 230 px, and every element below it sits 0.047 px higher. Boxes at half-pixel positions, such as the vertically centered "접기" label and the 12 px glyphs inside 19 px rows, then round to a different device pixel, which the diff images show as 1 px vertical shifts. Rebuilding the vanilla-extract sample with `14.2857%` makes all eleven states identical, which confirms that no other styling difference remains. The sub-pixel loss applies to any authored number with more than six significant digits, and a fix would keep authored numeric text instead of reprinting it.

## Porting Findings

Compiler behavior recorded while porting the sample, each a candidate fix or a documentation note:

- **`inset` folding on Lynx (fixed in `01a75f6`):** four `top`, `right`, `bottom`, `left: 0` longhands folded into one `inset: 0` rule, because Lightning CSS merges the four sides of a rule unconditionally during the host's final stylesheet pass, and the Lynx encoder dropped `inset` as unsupported, so five elements lost their offsets. The `zyzz/rspeedy` host now expands `inset` back into its longhands for the lynx target, which adds 0.1 kB for the three extra declarations.
- **Private records inside `namespace styles`:** a non-exported `const row = { ... } as const` inside the namespace makes every `cx` call over that namespace fail with `Composition requires statically known local style applications`. Moving the record to module scope compiles. The error points at the first `cx` argument, not at the record.
- **Theme data spreads:** `defineVars` rejects spreads in typography presets (`Theme data requires explicit properties without spreads, methods, or computed keys`), so presets repeat their scale values.
- **Template literal expressions:** `` width: `${100 / 7}%` `` is rejected (`Expected a literal string or number; expressions are not evaluated`) and needs the computed literal.
- **`vars()` scope:** the compiler emits `var(--z-…, fallback)` references, but the Lynx encoder keeps only the `{{--z-…}}` reference, so the root element must carry the `z-theme-theme` class through `vars({})` for tokens to resolve. `colorScheme` produces three `color-scheme` encoder warnings on Lynx.
- **Type declaration for `zyzz.css`:** TypeScript needs an ambient `declare module 'zyzz.css'` for the side-effect import.
