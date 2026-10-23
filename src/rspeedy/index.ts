/** Exposes the Zyzz Rspeedy plugin for Lynx builds. @module */
import type { RsbuildPlugin } from '@rsbuild/core'
import * as Path from 'node:path'
import * as Unplugin from '../unplugin/index.js'

/**
 * Compiles project sources and serves the combined stylesheet as the `zyzz.css` module.
 *
 * Import `zyzz.css` from the application entry so Lynx bundles the styles.
 * A relative `options.root` resolves from the Rspeedy project root, which is also the default.
 */
export function zyzz(options: Unplugin.Options = {}): RsbuildPlugin {
  return {
    name: 'zyzz',
    setup(api) {
      const root = Path.resolve(api.context.rootPath, options.root ?? '.')

      api.modifyRspackConfig((config) => {
        // Environments compile concurrently, so each receives its own graph state.
        config.plugins.push(Unplugin.rspack({ ...options, root }))
      })
    },
  }
}
