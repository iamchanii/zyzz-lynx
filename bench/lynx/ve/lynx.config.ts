/**
 * Rspeedy configuration for the vanilla-extract baseline of the Lynx bundle comparison.
 *
 * The compat plugin reproduces `@daangn/vanilla-extract-rspeedy-plugin` 0.2.2, which the
 * reference application uses: it keeps the ReactLynx plugin out of the vanilla-extract child
 * compiler and compiles the `.css.ts` modules with the SWC loader, so the sample depends only on
 * the public webpack plugin.
 * @module
 */
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { defineConfig } from '@lynx-js/rspeedy'
import type { RsbuildPlugin, Rspack } from '@rsbuild/core'
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin'

function pluginVanillaExtract(): RsbuildPlugin {
  return {
    name: 'vanilla-extract',
    setup(api) {
      api.modifyRspackConfig((config) => {
        config.plugins ??= []
        config.plugins.push(
          // The webpack plugin types name webpack's Compiler, which Rspack's shares at runtime.
          new VanillaExtractPlugin() as unknown as Rspack.RspackPluginInstance,
        )
        config.plugins.push({
          apply(compiler: Rspack.Compiler) {
            compiler.hooks.thisCompilation.tap(
              'VanillaExtractTypeScript',
              (compilation) => {
                const original =
                  compilation.createChildCompiler.bind(compilation)
                compilation.createChildCompiler = (
                  name,
                  outputOptions,
                  plugins,
                ) => {
                  const child = original(name, outputOptions, plugins)
                  if (!name?.startsWith('vanilla-extract-compiler'))
                    return child

                  child.hooks.finishMake.taps =
                    child.hooks.finishMake.taps.filter(
                      (tap) => tap.name !== 'ReactWebpackPlugin',
                    )
                  child.options.module.rules ??= []
                  child.options.module.rules.unshift({
                    test: /\.[cm]?[jt]sx?$/,
                    use: [
                      {
                        loader: 'builtin:swc-loader',
                        options: {
                          jsc: {
                            parser: {
                              decorators: true,
                              syntax: 'typescript',
                              tsx: false,
                            },
                          },
                        },
                      },
                    ],
                  })
                  return child
                }
              },
            )
          },
        })
      })
    },
  }
}

// Both samples share these ReactLynx and chunk settings, mirroring a production Lynx app.
export default defineConfig({
  performance: { chunkSplit: { strategy: 'split-by-module' } },
  plugins: [
    pluginReactLynx({ enableCSSInvalidation: true, enableCSSSelector: true }),
    pluginVanillaExtract(),
  ],
  source: { entry: { jobPost: './src/index.tsx' } },
})
