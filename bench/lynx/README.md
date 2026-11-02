# Lynx Bundle Comparison

Two ReactLynx sample applications with the same component tree, fixture data, and interaction state, styled once with vanilla-extract and once with Zyzz. The screen mirrors the structure of a production job-post detail screen: a header overlaid on an image gallery, detail rows and cards, author and review sections, horizontal recommendation lists, a map fallback, a notification nudge, a snackbar, a bottom sheet, and a footer with action buttons.

| Directory | Styling                                                                                | Plugin                                                                                            |
| --------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `ve/`     | `@vanilla-extract/css` modules (`style`, `styleVariants`, `keyframes`, `globalStyle`)  | `@vanilla-extract/webpack-plugin` with the Rspeedy child-compiler compat shim in `lynx.config.ts` |
| `zyzz/`   | `zyzz` (`style`, `variants`, `cx`, `keyframes`, `global`) in `namespace styles` blocks | `zyzz/rspeedy`                                                                                    |

Both configurations enable `enableCSSSelector` and `enableCSSInvalidation`, split dependencies by module, and build one `jobPost` entry. The `zyzz` sample uses the plugin defaults, including independent composition on Lynx. The `ve` sample keeps the reference application's class application form, template literals that join conditional class names. The `zyzz` sample follows the conventions in [Styling.md](Styling.md): definitions in a `namespace styles` at the bottom of each component file, tokens from `zyzz.config.ts`, spreads and `cx` for application, and `variants` recipes for enumerated choices.

## Measuring

`Measure.ts` builds each sample twice with the installed Rspeedy and writes `bench/results/lynx/<label>/<app>.json` plus a Markdown summary.

```sh
# Builds both samples against the workspace zyzz build
node bench/lynx/Measure.ts --label main

# Measures one sample against another checkout of this repository
node bench/lynx/Measure.ts --label 1fa9ece --app zyzz --library ../zyzz-lynx-worktrees/1fa9ece
```

The first build is a plain production build. It records the shipped `jobPost.lynx.bundle` and the external `static/js` chunks with raw, gzip, and Brotli sizes. The second build sets `DEBUG=rspeedy`, which keeps the intermediate `.lynx/jobPost/` assets the encoder otherwise deletes: `main-thread.js`, `background.<hash>.js`, the `jobPost.css` asset, the encoded template `tasm.json`, and `stats.json`.

- **Encoded CSS:** the rules the Lynx encoder kept in the template, serialized from `tasm.json`, with rule, declaration, class, `@media`, and `@keyframes` counts.
- **Threads:** `stats.json` module sizes grouped by the `react:main-thread` and `react:background` layers and split into application modules, style modules, and dependencies. These are pre-minification source sizes, useful for attribution rather than as shipped bytes.
- **Debug bundle:** the `.lynx.bundle` of the debug build is larger than the plain one because the encoder embeds debug information, so the headline bundle always comes from the plain build.

## Commit Checkpoints

The `--library` option measures the `zyzz` sample against a worktree of this repository at an earlier commit. A worktree needs `pnpm install`, a native binding, and the package `dist`:

```sh
git worktree add --detach ../zyzz-lynx-worktrees/<sha> <sha>
cd ../zyzz-lynx-worktrees/<sha>
pnpm install --frozen-lockfile
# The unoptimized binding-test profile compiles in under a minute and emits identical output.
CARGO_TARGET_DIR=../target pnpm exec napi build --platform --profile binding-test \
  --package-json-path crates/binding/package.json --manifest-path crates/binding/Cargo.toml \
  --output-dir binding --no-js
# zile checks that every exported artifact exists; the browser wasm artifacts are not loaded by Node.
cp ../../zyzz-lynx/src/web/internal/Wasm.generated.ts src/web/internal/
cp ../../zyzz-lynx/binding/compiler.wasm binding/
pnpm exec zile && node scripts/build-default-theme.ts && node scripts/build-native-adapter.ts
```

The fork history is linear, so a worktree at commit N holds the Rspeedy base commits plus every compiler commit up to N, which is the same state as cherry-picking those commits onto the base.

## Visual Comparison

`visual/Compare.ts` checks that both samples render the same. Each sample's `lynx.web.config.ts` builds a `dist-web/jobPost.web.bundle` for Lynx for Web, and the script hosts each bundle in `@lynx-js/web-core`, drives both through the same interaction states in headless Chromium, and compares the screenshots with `pixelmatch`.

```sh
# Builds the web bundles
(cd bench/lynx/ve && pnpm exec rspeedy build -c lynx.web.config.ts)
(cd bench/lynx/zyzz && pnpm exec rspeedy build -c lynx.web.config.ts)

# Writes screenshots, diff images, a summary, and a gallery page to bench/results/lynx/visual/
node bench/lynx/visual/Compare.ts
open bench/results/lynx/visual/index.html
```

The script exits with status 1 when a state that does not animate differs. [Results.md](Results.md) records the latest comparison and the cause of the remaining difference.

## Results

Recorded on 2026-11-02 with `Measure.ts` on an Apple Silicon macOS host: Rspeedy 0.18.2, `@lynx-js/react` 0.128.0, `@vanilla-extract/css` 1.21.2, and the workspace Zyzz build at `5ceb3d0`. Sizes are bytes on disk divided by 1024, compressed with `node:zlib` at gzip level 9 and the default Brotli quality (11). [Results.md](Results.md) holds the per-commit ledger, the experiments behind each change, and the analysis of what remains.

### Shipped Artifacts

The headline is `jobPost.lynx.bundle` from a plain production build. The thread scripts and the encoded stylesheet come from the `DEBUG=rspeedy` build, which keeps the intermediates the encoder otherwise deletes.

| Artifact         | vanilla-extract raw / gzip / br | Zyzz raw / gzip / br   | Δ raw           | Δ gzip          | Δ br            |
| ---------------- | ------------------------------- | ---------------------- | --------------- | --------------- | --------------- |
| `.lynx.bundle`   | 247.3 / 63.3 / 52.4 kB          | 177.6 / 58.7 / 49.4 kB | −69.7 kB (−28%) | −4.6 kB (−7.3%) | −3.0 kB (−5.7%) |
| `main-thread.js` | 131.4 / 29.0 / 24.5 kB          | 113.8 / 29.7 / 25.6 kB | −17.7 kB (−13%) | +0.7 kB (+2.3%) | +1.1 kB (+4.4%) |
| `background.js`  | 37.3 / 12.3 / 10.4 kB           | 34.7 / 11.7 / 10.0 kB  | −2.6 kB (−6.9%) | −0.6 kB (−5.0%) | −0.4 kB (−4.0%) |
| Encoded CSS      | 47.6 / 6.4 / 5.8 kB             | 18.1 / 3.9 / 3.4 kB    | −29.5 kB (−62%) | −2.5 kB (−39%)  | −2.3 kB (−40%)  |
| External chunks  | 54.8 / 20.6 / 18.7 kB           | 54.8 / 20.6 / 18.7 kB  | 0               | 0               | 0               |

| Stylesheet         | vanilla-extract | Zyzz |
| ------------------ | --------------- | ---- |
| Rules              | 503             | 414  |
| Declarations       | 1827            | 569  |
| Classes            | 462             | 417  |
| `@media` rules     | 3               | 3    |
| `@keyframes` rules | 11              | 11   |

The raw bundle gap closes through the stylesheet and the class-name text, which compress well, so the compressed gap is smaller than the raw one. The Zyzz main thread is 18 kB smaller raw but compresses 0.7 kB larger under gzip, which points at the class lists: several short shared names per element repeat less than vanilla-extract's one hashed class per element. The external chunks are the same ReactLynx runtime in both builds.

### Progress

Each row is the `zyzz` sample's `.lynx.bundle` after one change on this branch, measured against a worktree of that commit. The vanilla-extract sample stays at 247.3 / 63.3 / 52.4 kB.

| Change                                                                         | Commit    | raw      | gzip    | br      |
| ------------------------------------------------------------------------------ | --------- | -------- | ------- | ------- |
| Baseline, fork `main`                                                          | `980230d` | 291.9 kB | 72.6 kB | 58.3 kB |
| Expand `inset` into longhands on Lynx                                          | `01a75f6` | 292.0 kB | 72.6 kB | 58.3 kB |
| Dense graph-wide class names on Lynx                                           | `2829786` | 260.7 kB | 70.4 kB | 56.7 kB |
| Compose namespace members declared beside `const` records                      | `6423ed0` | 260.7 kB | 70.4 kB | 56.7 kB |
| Fold literal `vars()` selections into constant props                           | `4a13a96` | 260.0 kB | 70.3 kB | 56.7 kB |
| Leave out the selector of configurations only folded selections read           | `05f0f4c` | 257.3 kB | 69.0 kB | 55.5 kB |
| Select recipe and conditional style compositions from class tables             | `44595ed` | 259.2 kB | 67.9 kB | 54.2 kB |
| Compose definitions independently by default on Lynx                           | `ec8a4ee` | 219.0 kB | 63.6 kB | 52.3 kB |
| Share recipe base declarations as units                                        | `8f14e0d` | 211.4 kB | 62.8 kB | 51.8 kB |
| Concatenate flat Lynx compositions with override copies                        | `2f027bd` | 195.4 kB | 60.9 kB | 50.8 kB |
| Share override copies across a module's compositions                           | `904924f` | 195.2 kB | 60.9 kB | 50.8 kB |
| Read recipe axes directly and coerce only boolean-like and numeric choices     | `1a457bf` | 194.1 kB | 60.7 kB | 50.8 kB |
| Name token properties and keyframes densely and omit `var()` fallbacks on Lynx | `778c12d` | 181.6 kB | 59.3 kB | 49.8 kB |
| Merge units with identical usage sets in production bundles                    | `5ceb3d0` | 177.6 kB | 58.7 kB | 49.4 kB |

### Rendering

`visual/Compare.ts` renders both samples through Lynx for Web and compares eleven interaction states pixel by pixel. Eight states are identical. The three states with the calendar open differ in at most 0.09% of pixels, all from one cause: the compiler prints `width: 14.285714285714286%` as `14.2857%`, since it reprints declarations through Lightning CSS with six significant digits, which shortens the calendar by 0.047 px and shifts half-pixel boxes below it by one device pixel. Rebuilding the vanilla-extract sample with `14.2857%` makes every state identical. Results.md records the run and the diff images live in `bench/results/lynx/visual/`.
