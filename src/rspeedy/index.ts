/** Exposes the Zyzz Rspeedy plugin for Lynx builds. @module */
import type { RsbuildPlugin, Rspack } from '@rsbuild/core'
import * as Path from 'node:path'
import * as Unplugin from '../unplugin/index.js'

/**
 * Compiles project sources and serves the combined stylesheet as the `zyzz.css` module.
 *
 * Import `zyzz.css` from the application entry so Lynx bundles the styles.
 * A relative `options.root` resolves from the Rspeedy project root, which is also the default.
 * The transform runs before every other loader, including `enforce: 'pre'` loaders.
 */
export function zyzz(options: Unplugin.Options = {}): RsbuildPlugin {
  return {
    name: 'zyzz',
    setup(api) {
      const root = Path.resolve(api.context.rootPath, options.root ?? '.')

      api.modifyRspackConfig((config) => {
        // Environments compile concurrently, so each receives its own graph state.
        const plugin = Unplugin.rspack({ ...options, root })

        config.plugins.push({
          apply(compiler: Rspack.Compiler) {
            const rules = compiler.options.module.rules
            const count = rules.length
            plugin.apply(compiler)
            // The unplugin prepends its pre-enforced rules.
            const added = rules.slice(0, rules.length - count)

            // Loaders of one stage run from the last rule to the first, so the
            // appended rules see the authored source. Waiting until every
            // plugin has applied also places them after rules added later.
            compiler.hooks.afterEnvironment.tap('zyzz', () => {
              const current = compiler.options.module.rules
              const others = current.filter((rule) => !added.includes(rule))
              current.splice(0, current.length, ...others, ...added)
            })
          },
        })
      })
    },
  }
}
