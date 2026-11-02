# Lynx Bundle Comparison

Two ReactLynx sample applications with the same component tree, fixture data, and interaction state, styled once with vanilla-extract and once with Zyzz. The screen mirrors the structure of a production job-post detail screen: a header overlaid on an image gallery, detail rows and cards, author and review sections, horizontal recommendation lists, a map fallback, a notification nudge, a snackbar, a bottom sheet, and a footer with action buttons.

| Directory | Styling                                                                                | Plugin                                                                                            |
| --------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `ve/`     | `@vanilla-extract/css` modules (`style`, `styleVariants`, `keyframes`, `globalStyle`)  | `@vanilla-extract/webpack-plugin` with the Rspeedy child-compiler compat shim in `lynx.config.ts` |
| `zyzz/`   | `zyzz` (`style`, `variants`, `cx`, `keyframes`, `global`) in `namespace styles` blocks | `zyzz/rspeedy`                                                                                    |

Both configurations enable `enableCSSSelector` and `enableCSSInvalidation`, split dependencies by module, and build one `jobPost` entry. The `ve` sample keeps the reference application's class application form, template literals that join conditional class names. The `zyzz` sample follows the conventions in [Styling.md](Styling.md): definitions in a `namespace styles` at the bottom of each component file, tokens from `zyzz.config.ts`, spreads and `cx` for application, and `variants` recipes for enumerated choices.

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

## Results

See [Results.md](Results.md) for the recorded comparison and the per-commit history.
