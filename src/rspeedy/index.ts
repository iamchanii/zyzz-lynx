/** Exposes the Zyzz Rspeedy plugin for Lynx builds. @module */
import type { RsbuildPlugin, Rspack } from '@rsbuild/core'
import * as Path from 'node:path'
import * as Merge from './internal/Merge.js'
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
 * so recipes select with classes and emit one rule per choice and compound. Definitions compose
 * independently unless a config or `options.composition` says otherwise, and a production build
 * merges the units that every class list applies together unless `options.units` keeps them
 * atomic.
 */
export function zyzz(options: zyzz.Options = {}): RsbuildPlugin {
  return {
    name: 'zyzz',
    setup(api) {
      const { inject, units, ...rest } = options
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
        // Lynx elements combine styles only through `cx`, so repeated declarations share rules.
        const plugin = Unplugin.rspack({
          composition: 'independent',
          ...rest,
          root,
          target: 'lynx',
        })

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

            // Ordered composition places rules by module, so a unit never moves.
            if (
              compiler.options.mode !== 'production' ||
              rest.composition === 'ordered' ||
              units === 'atomic'
            )
              return
            compiler.hooks.thisCompilation.tap('zyzz', (compilation) => {
              // The chunk assets exist and the minimizer has not run, so the
              // literals read as the compiler printed them and the minimizer
              // and source map stages see the merged assets.
              compilation.hooks.processAssets.tap(
                {
                  name: 'zyzz',
                  stage:
                    compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
                },
                () => merge(compiler, compilation),
              )
            })
          },
        })
      })
    },
  }
}

/** Rspeedy plugin contracts. */
export declare namespace zyzz {
  /** Portable build configuration without the target, which is always Lynx. */
  type Options = Omit<Unplugin.Options, 'composition' | 'target'> & {
    /**
     * Composition mode for definitions whose config sets none. Lynx elements combine styles
     * only through `cx`, so the default is `'independent'`, which shares one rule for a
     * declaration across every style that repeats it. `'ordered'` keeps each module's rules
     * at their own cascade position, so a class passed in through `className` wins by
     * definition order.
     */
    readonly composition?: 'independent' | 'ordered' | undefined
    /**
     * Imports `zyzz.css` before the modules of every entry in every environment, after any
     * configured `source.preEntry` modules. A manual import of `zyzz.css` stays safe and no
     * longer decides the stylesheet's position. Defaults to false.
     */
    readonly inject?: boolean | undefined
    /**
     * How a production build prints the units of independent composition. `'merged'`, the
     * default, joins units that every class list of the bundle applies together into one rule
     * under the first unit's name, and `'atomic'` keeps one rule per unit. Development builds
     * and `'ordered'` composition keep every rule.
     */
    readonly units?: 'atomic' | 'merged' | undefined
  }
}

/**
 * Rewrites the compilation's stylesheets and thread scripts so units with identical usage sets
 * share one rule. Edits replace only the affected spans, so the chunks' source maps follow.
 */
function merge(compiler: Rspack.Compiler, compilation: Rspack.Compilation) {
  const scripts: Record<string, string> = {}
  const stylesheets: Record<string, string> = {}
  for (const asset of compilation.getAssets()) {
    if (asset.name.endsWith('.css'))
      stylesheets[asset.name] = asset.source.source().toString()
    else if (/\.[cm]?js$/.test(asset.name))
      scripts[asset.name] = asset.source.source().toString()
  }

  const result = Merge.plan({ scripts, stylesheets })
  for (const [name, edits] of Object.entries(result.edits)) {
    const asset = compilation.getAsset(name)
    if (!asset) continue
    const source = new compiler.webpack.sources.ReplaceSource(asset.source)
    for (const edit of edits)
      source.replace(edit.start, edit.end - 1, edit.text)
    compilation.updateAsset(name, source)
  }
}
