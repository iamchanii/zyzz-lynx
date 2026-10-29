/** Exposes the Zyzz Rspeedy plugin for Lynx builds. @module */
import type { RsbuildPlugin, Rspack } from '@rsbuild/core'
import * as Path from 'node:path'
import * as Unplugin from '../unplugin/index.js'

/**
 * Compiles project sources for the Lynx target and serves the combined stylesheet as the
 * `zyzz.css` module.
 *
 * Import `zyzz.css` from the application entry so Lynx bundles the styles, or set
 * `options.inject` to add it before every entry's own modules.
 * A relative `options.root` resolves from the Rspeedy project root, which is also the default.
 * The transform runs before every other loader, including `enforce: 'pre'` loaders.
 * Every environment compiles for the Lynx template encoder, which keeps only flat class rules,
 * so recipes select with classes and emit one rule per choice and compound.
 */
export function zyzz(options: zyzz.Options = {}): RsbuildPlugin {
  return {
    name: 'zyzz',
    setup(api) {
      const { inject, ...rest } = options
      const root = Path.resolve(api.context.rootPath, options.root ?? '.')

      // Rsbuild adds pre-entries ahead of each entry's modules, and a manual
      // import of the same request resolves to the same module.
      if (inject)
        api.modifyRsbuildConfig((config, utils) =>
          utils.mergeRsbuildConfig(config, {
            source: { preEntry: ['zyzz.css'] },
          }),
        )

      api.modifyRspackConfig((config) => {
        // Environments compile concurrently, so each receives its own graph state.
        const plugin = Unplugin.rspack({ ...rest, root, target: 'lynx' })

        config.plugins.push({
          apply(compiler: Rspack.Compiler) {
            const rules = compiler.options.module.rules
            const before = new Set(rules)
            plugin.apply(compiler)
            const added = rules.filter((rule) => !before.has(rule))

            // Loaders of one stage run from the last rule to the first, so the
            // appended rules see the authored source. `initialize` is the last
            // setup hook before Rspack reads the rules, so the final stage also
            // places them after rules that plugins add in earlier setup hooks.
            compiler.hooks.initialize.tap(
              { name: 'zyzz', stage: Infinity },
              () => {
                const current = compiler.options.module.rules
                const others = current.filter((rule) => !added.includes(rule))
                current.splice(0, current.length, ...others, ...added)
              },
            )
          },
        })
      })
    },
  }
}

/** Rspeedy plugin contracts. */
export declare namespace zyzz {
  /** Portable build configuration without the target, which is always Lynx. */
  type Options = Omit<Unplugin.Options, 'target'> & {
    /**
     * Imports `zyzz.css` before the modules of every entry in every environment. A manual
     * import of `zyzz.css` stays safe and no longer decides the stylesheet's position.
     * Defaults to false.
     */
    readonly inject?: boolean | undefined
  }
}
