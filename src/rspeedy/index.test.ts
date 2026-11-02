/** Builds ReactLynx applications with Rspeedy and inspects the encoded Lynx stylesheet. @module */
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { createRspeedy } from '@lynx-js/rspeedy'
import type { Config } from '@lynx-js/rspeedy'
import type { RsbuildPlugin, Rspack } from '@rsbuild/core'
import * as Fs from 'node:fs/promises'
import * as Path from 'node:path'
import { describe, expect, test } from 'vite-plus/test'
import { zyzz } from 'zyzz/rspeedy'

type Rule =
  | {
      readonly type?: 'StyleRule' | undefined
      readonly selectorText: { readonly value: string }
      readonly style: readonly {
        readonly name: string
        readonly value: string
      }[]
    }
  | {
      readonly type: 'MediaRule'
      readonly prelude: { readonly value: string }
      readonly rules: readonly Rule[]
    }

type Template = {
  readonly css: {
    readonly cssMap: Readonly<Record<string, readonly Rule[]>>
  }
  readonly lepusCode: { readonly root: string }
}

async function fixture() {
  const root = await Fs.mkdtemp(Path.resolve('.fixture-rspeedy-'))
  await Fs.mkdir(Path.join(root, 'src'))
  await Fs.writeFile(
    Path.join(root, 'src/index.tsx'),
    `import 'zyzz.css'\nimport { root } from '@lynx-js/react'\nimport { App } from './App'\n\nroot.render(<App />)\n`,
  )
  await Fs.writeFile(
    Path.join(root, 'src/App.tsx'),
    `import { style } from 'zyzz'\n\nexport function App() {\n  return <view {...card()}><text {...title()}>Hello</text></view>\n}\n\nconst card = style({ backgroundColor: 'rgb(0, 102, 204)', padding: '8px' })\n\nconst title = style({ color: 'rgb(255, 255, 255)', fontSize: '20px' })\n`,
  )
  return root
}

async function create(
  root: string,
  config: Config = {},
  options: zyzz.Options = {},
) {
  return createRspeedy({
    cwd: root,
    loadEnv: false,
    rspeedyConfig: {
      // Development builds write the encoded template to `tasm.json`.
      mode: 'development',
      plugins: [pluginReactLynx(), zyzz(options)],
      source: { entry: { main: './src/index.tsx' } },
      ...config,
    },
  })
}

async function files(directory: string): Promise<readonly string[]> {
  const entries = await Fs.readdir(directory, {
    recursive: true,
    withFileTypes: true,
  })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      Path.relative(directory, Path.join(entry.parentPath, entry.name)),
    )
    .sort()
}

async function template(root: string, entry = 'main') {
  const template = JSON.parse(
    await Fs.readFile(Path.join(root, `dist/.lynx/${entry}/tasm.json`), 'utf8'),
  ) as Template

  // Media rules nest the style rules the encoder kept under them.
  const print = (rule: Rule): string =>
    rule.type === 'MediaRule'
      ? `@media ${rule.prelude.value} { ${rule.rules.map(print).join(' ')} }`
      : `${rule.selectorText.value} { ${rule.style.map((declaration) => `${declaration.name}: ${declaration.value}`).join('; ')} }`

  return {
    css: Object.values(template.css.cssMap).flat().map(print),
    mainThread: template.lepusCode.root,
  }
}

/**
 * The per-thread scripts of a production build that loaded the selection runtime, by the chunk
 * name with its content hash elided. The runtime's helper import and its validation message
 * mark the chunk.
 */
async function selecting(root: string, entry = 'main') {
  const directory = Path.join(root, 'dist/.lynx', entry)
  const chunks: string[] = []

  for (const file of await files(directory)) {
    if (!file.endsWith('.js')) continue
    const source = await Fs.readFile(Path.join(directory, file), 'utf8')

    if (
      source.includes('__zyzzSelection') ||
      source.includes('Invalid variable selection.')
    )
      chunks.push(file.replace(/\.[0-9a-f]+\.js$/, '.[hash].js'))
  }

  return chunks
}

describe('zyzz', () => {
  test('bundles the zyzz.css module into the Lynx template', async () => {
    const root = await fixture()
    try {
      const result = await (await create(root)).build()
      await result.close()

      const { css, mainThread } = await template(root)
      expect(css).toMatchInlineSnapshot(`
        [
          ".z0 { background-color: #06c }",
          ".z1 { padding: 8px }",
          ".z2 { color: #fff }",
          ".z3 { font-size: 20px }",
        ]
      `)
      // The main thread adds the dense names the template's rules carry.
      expect(mainThread.match(/"z\w+ z\w+"/g)).toMatchInlineSnapshot(`
        [
          ""z0 z1"",
          ""z2 z3"",
        ]
      `)
      expect(mainThread.includes('style({')).toMatchInlineSnapshot(`false`)

      expect(
        (await Fs.readdir(Path.join(root, 'dist'))).filter((file) =>
          file.startsWith('zyzz'),
        ),
      ).toMatchInlineSnapshot(`[]`)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('leaves entries without zyzz.css by default', async () => {
    const root = await fixture()
    try {
      const file = Path.join(root, 'src/index.tsx')
      await Fs.writeFile(
        file,
        (await Fs.readFile(file, 'utf8')).replace("import 'zyzz.css'\n", ''),
      )

      const result = await (await create(root)).build()
      await result.close()

      expect((await template(root)).css).toMatchInlineSnapshot(`[]`)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('injects zyzz.css into every entry with options.inject', async () => {
    const root = await fixture()
    try {
      // The first entry imports its own stylesheet before the manual import,
      // and the second entry omits the manual import.
      const file = Path.join(root, 'src/index.tsx')
      const source = await Fs.readFile(file, 'utf8')
      await Fs.writeFile(
        Path.join(root, 'src/app.css'),
        '.app { margin: 4px }\n',
      )
      await Fs.writeFile(file, `import './app.css'\n${source}`)
      await Fs.writeFile(
        Path.join(root, 'src/other.tsx'),
        source.replace("import 'zyzz.css'\n", ''),
      )

      const result = await (
        await create(
          root,
          {
            source: {
              entry: { main: './src/index.tsx', other: './src/other.tsx' },
            },
          },
          { inject: true },
        )
      ).build()
      await result.close()

      // The injected stylesheet precedes the entry's own imports once.
      expect((await template(root)).css).toMatchInlineSnapshot(`
        [
          ".z0 { background-color: #06c }",
          ".z1 { padding: 8px }",
          ".z2 { color: #fff }",
          ".z3 { font-size: 20px }",
          ".app { margin: 4px }",
        ]
      `)
      expect((await template(root, 'other')).css).toMatchInlineSnapshot(`
        [
          ".z0 { background-color: #06c }",
          ".z1 { padding: 8px }",
          ".z2 { color: #fff }",
          ".z3 { font-size: 20px }",
        ]
      `)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('keeps the zyzz.css module out of split-by-module vendor chunks', async () => {
    const root = await fixture()
    try {
      const result = await (
        await create(root, {
          performance: { chunkSplit: { strategy: 'split-by-module' } },
        })
      ).build()
      await result.close()

      // Split chunks become separate requests in Lynx and carry no source map.
      expect(
        (await files(Path.join(root, 'dist'))).filter((file) =>
          /virtual|zyzz/.test(file),
        ),
      ).toMatchInlineSnapshot(`[]`)
      expect((await template(root)).css).toMatchInlineSnapshot(`
        [
          ".z0 { background-color: #06c }",
          ".z1 { padding: 8px }",
          ".z2 { color: #fff }",
          ".z3 { font-size: 20px }",
        ]
      `)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('watches only existing files for the zyzz.css module', async () => {
    const root = await fixture()
    try {
      const rspeedy = await create(root)
      let dependencies: readonly string[] = []
      rspeedy.onAfterBuild((context) => {
        if (context.stats && 'compilation' in context.stats)
          dependencies = [...context.stats.compilation.fileDependencies]
      })
      const result = await rspeedy.build()
      await result.close()

      // The watcher ignores `node_modules` and reports any other missing
      // dependency as removed, which rebuilds once after it starts.
      const missing = await Promise.all(
        dependencies
          .filter((file) => !/[/\\]node_modules[/\\]/.test(file))
          .map(async (file) =>
            (await Fs.stat(file).catch(() => undefined))
              ? undefined
              : Path.relative(root, file),
          ),
      )
      expect(missing.filter(Boolean)).toMatchInlineSnapshot(`[]`)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('compiles literal constants from packages without a Zyzz dependency', async () => {
    const root = await fixture()
    try {
      // Mirrors @seed-design/lynx-css: nested namespace re-exports of `var()` strings.
      const tokens = Path.join(root, 'node_modules/@acme/tokens')
      await Fs.mkdir(Path.join(tokens, 'vars/color'), { recursive: true })
      await Fs.writeFile(
        Path.join(tokens, 'package.json'),
        JSON.stringify({
          exports: { './vars': { import: './vars/index.mjs' } },
          name: '@acme/tokens',
          type: 'module',
        }),
      )
      await Fs.writeFile(
        Path.join(tokens, 'vars/index.mjs'),
        'export * as vars from "./vars.mjs";\n',
      )
      await Fs.writeFile(
        Path.join(tokens, 'vars/vars.mjs'),
        'export * as color from "./color/index.mjs";\n',
      )
      await Fs.writeFile(
        Path.join(tokens, 'vars/color/index.mjs'),
        'export * as bg from "./bg.mjs";\n',
      )
      await Fs.writeFile(
        Path.join(tokens, 'vars/color/bg.mjs'),
        'export const layerDefault = "var(--seed-color-bg-layer-default)";\nexport const layerFloating = "var(--seed-color-bg-layer-floating)";\n',
      )
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { vars } from '@acme/tokens/vars'\nimport { style } from 'zyzz'\n\nexport function App() {\n  return <view {...styles.root()} />\n}\n\nnamespace styles {\n  export const root = style({ backgroundColor: vars.color.bg.layerDefault, borderColor: vars.color.bg['layerFloating'] })\n}\n`,
      )

      const result = await (await create(root)).build()
      await result.close()

      expect((await template(root)).css).toMatchInlineSnapshot(`
        [
          ".z0 { background-color: {{--seed-color-bg-layer-default}} }",
          ".z1 { border-color: {{--seed-color-bg-layer-floating}} }",
        ]
      `)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('bundles set and variant selection without Object.hasOwn', async () => {
    const root = await fixture()
    try {
      await Fs.writeFile(
        Path.join(root, 'src/config.ts'),
        `import { Config, Vars } from 'zyzz'\n\nconst base = Vars.define({ color: { brand: '#0066cc' } })\n\nconst large = Vars.extend(base, { color: { brand: '#ff0000' } })\n\nexport const { variants, vars } = Config.create({ defaultVars: 'base', vars: { base, large } })\n`,
      )
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { variants, vars } from './config'\n\nexport function App(props: { tone?: 'neutral' | 'success' }) {\n  return <view {...vars({ set: 'large' })}><text {...badge({ tone: props.tone })}>Hello</text></view>\n}\n\nconst badge = variants({\n  defaultVariants: { tone: 'neutral' },\n  variants: { tone: { neutral: { color: vars.color.brand }, success: { color: '#00aa00 !custom' } } },\n})\n`,
      )

      const result = await (await create(root)).build()
      await result.close()

      // Lynx's JavaScript engines do not implement Object.hasOwn.
      const source = await Fs.readFile(
        Path.join(root, 'dist/.lynx/main/tasm.json'),
        'utf8',
      )
      expect(source.includes('Object.hasOwn(')).toMatchInlineSnapshot(`false`)
      expect(source.includes('z-theme-large')).toMatchInlineSnapshot(`true`)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('folds literal scope selections so no thread loads the composition runtime', async () => {
    const root = await fixture()
    try {
      await Fs.writeFile(
        Path.join(root, 'src/config.ts'),
        `import { defineConfig, defineVars } from 'zyzz'\n\nconst theme = defineVars({ color: { brand: '#0066cc' } })\n\nexport const { style, variants, vars } = defineConfig({ vars: theme })\n`,
      )
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { cx } from 'zyzz'\nimport { style, vars } from './config'\n\nexport function App() {\n  return <view {...cx(vars({}), styles.page())}><text {...vars({ colorScheme: 'dark' })}>Hello</text></view>\n}\n\nnamespace styles {\n  export const page = style({ color: vars.color.brand })\n}\n`,
      )

      const result = await (await create(root)).build()
      await result.close()

      const { css, mainThread } = await template(root)
      expect(css).toMatchInlineSnapshot(`
        [
          ".z_scheme-dark { color-scheme: dark }",
          ".z_scheme-light { color-scheme: light }",
          ".z_scheme-light-dark { color-scheme: light dark }",
          ".z-theme-theme {  }",
          ".z0 { color: {{--z-color-brand}} }",
        ]
      `)
      expect(mainThread.match(/"z-theme-theme[^"]*"/g)).toMatchInlineSnapshot(`
        [
          ""z-theme-theme z0"",
          ""z-theme-theme z_scheme-dark"",
        ]
      `)
      expect(
        mainThread.includes('zyzz.composition.input.v1'),
      ).toMatchInlineSnapshot(`false`)

      // The composition runtime marks its module with this protocol key.
      const chunks = (await files(Path.join(root, 'dist'))).filter((file) =>
        file.endsWith('.js'),
      )
      const composed: string[] = []

      for (const chunk of chunks) {
        const source = await Fs.readFile(Path.join(root, 'dist', chunk), 'utf8')

        if (source.includes('zyzz.composition.input.v1')) composed.push(chunk)
      }

      expect(chunks).toMatchInlineSnapshot(`
        [
          ".lynx/main/background.js",
          ".lynx/main/main-thread.js",
        ]
      `)
      expect(composed).toMatchInlineSnapshot(`[]`)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('leaves the selection runtime out of production chunks when every selection folds', async () => {
    const root = await fixture()
    const debug = process.env.DEBUG
    try {
      // Rspack reads the nearest package.json for side effects. Without one, the fixture inherits
      // this repository's `sideEffects` list and drops the configuration module whole.
      await Fs.writeFile(
        Path.join(root, 'package.json'),
        '{ "name": "fixture", "private": true, "type": "module" }\n',
      )
      await Fs.writeFile(
        Path.join(root, 'src/config.ts'),
        `import { defineConfig, defineVars } from 'zyzz'\n\nconst theme = defineVars({ color: { brand: '#0066cc' }, spacing: { page: '16px' } })\n\nexport const { style, variants, vars } = defineConfig({ vars: theme })\n`,
      )
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { style, variants, vars } from './config'\n\nexport function App() {\n  return <view {...vars({})}><text {...styles.title()}>Hello</text><text {...styles.tone({ tone: 'quiet' })}>World</text></view>\n}\n\nnamespace styles {\n  export const title = style({ color: vars.color.brand, padding: vars.spacing.page })\n  export const tone = variants({ variants: { tone: { quiet: { color: 'brand' }, loud: { padding: 'page' } } } })\n}\n`,
      )

      // The template plugin keeps the per-thread scripts beside the bundle when DEBUG names
      // rspeedy. Unminified output leaves tree shaking as the only reason a module disappears.
      process.env.DEBUG = 'rspeedy'
      const result = await (
        await create(root, { mode: 'production', output: { minify: false } })
      ).build()
      await result.close()

      expect(
        (await files(Path.join(root, 'dist/.lynx/main')))
          .filter((file) => file.endsWith('.js'))
          .map((file) => file.replace(/\.[0-9a-f]+\.js$/, '.[hash].js')),
      ).toMatchInlineSnapshot(`
        [
          "background.[hash].js",
          "main-thread.js",
        ]
      `)
      // The configuration module emits no selector, so neither thread loads the runtime.
      expect(await selecting(root)).toMatchInlineSnapshot(`[]`)

      // A selection with a dynamic argument keeps the selector on both threads.
      await Fs.writeFile(
        Path.join(root, 'src/config.ts'),
        `import { defineConfig } from 'zyzz'\n\nexport const { style, vars } = defineConfig({ defaultVars: 'base', vars: { base: { color: { brand: '#0066cc' } }, mint: { color: { brand: '#117755' } } } })\n`,
      )
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { style, vars } from './config'\n\nexport function App(props: { theme: 'base' | 'mint' }) {\n  return <view {...vars({ set: props.theme })}><text {...styles.title()}>Hello</text></view>\n}\n\nnamespace styles {\n  export const title = style({ color: vars.color.brand })\n}\n`,
      )

      const dynamic = await (
        await create(root, { mode: 'production', output: { minify: false } })
      ).build()
      await dynamic.close()

      expect(await selecting(root)).toMatchInlineSnapshot(`
        [
          "background.[hash].js",
          "main-thread.js",
        ]
      `)
    } finally {
      if (debug === undefined) delete process.env.DEBUG
      else process.env.DEBUG = debug
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 120_000)

  test('compiles sources before pre-enforced loaders', async () => {
    const root = await fixture()
    try {
      // Mirrors source-rewriting pre loaders such as a GraphQL Babel optimizer.
      const loader = Path.join(root, 'pre-loader.cjs')
      await Fs.writeFile(
        loader,
        "module.exports = function (source) { return source + '\\nglobalThis.preLoaded = true\\n' }\n",
      )
      const lateLoader = Path.join(root, 'late-loader.cjs')
      await Fs.writeFile(
        lateLoader,
        "module.exports = function (source) { return source + '\\nglobalThis.lateLoaded = true\\n' }\n",
      )
      await Fs.writeFile(
        Path.join(root, 'src/store.ts'),
        'export const store = { items: [] as readonly string[] }\n',
      )
      await Fs.writeFile(
        Path.join(root, 'src/index.tsx'),
        `import 'zyzz.css'\nimport { root } from '@lynx-js/react'\nimport { App } from './App'\nimport { store } from './store'\n\nconsole.log(store)\nroot.render(<App />)\n`,
      )

      // Appends a pre rule from a setup hook tapped after the Zyzz plugin applies.
      const late: RsbuildPlugin = {
        name: 'late',
        setup(api) {
          api.modifyRspackConfig((config) => {
            config.plugins.push({
              apply(compiler: Rspack.Compiler) {
                compiler.hooks.afterEnvironment.tap('late', () => {
                  compiler.options.module.rules.push({
                    enforce: 'pre',
                    test: /\.tsx?$/,
                    use: [lateLoader],
                  })
                })
              },
            })
          })
        },
      }

      const rspeedy = await createRspeedy({
        cwd: root,
        loadEnv: false,
        rspeedyConfig: {
          mode: 'development',
          plugins: [pluginReactLynx(), zyzz(), late],
          source: { entry: { main: './src/index.tsx' } },
          tools: {
            rspack: {
              module: {
                rules: [{ enforce: 'pre', test: /\.tsx?$/, use: [loader] }],
              },
            },
          },
        },
      })
      let errors: readonly string[] = []
      rspeedy.onAfterBuild((context) => {
        errors = (
          context.stats?.toJson({ all: false, errors: true }).errors ?? []
        ).map((error) => error.message)
      })
      const result = await rspeedy.build()
      await result.close()

      expect(errors).toMatchInlineSnapshot(`[]`)

      const { css, mainThread } = await template(root)
      expect(css).toMatchInlineSnapshot(`
        [
          ".z0 { background-color: #06c }",
          ".z1 { padding: 8px }",
          ".z2 { color: #fff }",
          ".z3 { font-size: 20px }",
        ]
      `)
      expect(mainThread.includes('globalThis.preLoaded')).toMatchInlineSnapshot(
        `true`,
      )
      expect(
        mainThread.includes('globalThis.lateLoaded'),
      ).toMatchInlineSnapshot(`true`)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('encodes recipe choices, compounds, and compositions as flat class rules', async () => {
    const root = await fixture()
    try {
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { cx, style, variants } from 'zyzz'
import { Note } from './Note'

export function App(props: { tone?: 'neutral' | 'success' }) {
  return (
    <view {...styles.card({ size: 'large', tone: props.tone })}>
      <text className={styles.badge({ tone: props.tone, className: 'extra' })}>Hello</text>
      <text {...cx(styles.card({ size: 'small', tone: 'success' }), styles.quiet())}>Quiet</text>
      <Note />
    </view>
  )
}

namespace styles {
  export const card = variants({
    base: { padding: '2px' },
    compoundVariants: [{ style: { opacity: 0.5 }, when: { size: ['large', 'small'], tone: 'success' } }],
    defaultVariants: { tone: 'neutral' },
    variants: {
      size: { large: { height: '40px', '@media (min-width: 1px)': { width: '40px' } }, small: { height: '20px' } },
      tone: { neutral: { color: 'rgb(0, 0, 0)' }, success: { color: 'rgb(0, 170, 0)' } },
    },
  })

  export const badge = variants({
    base: { fontSize: '12px' },
    compoundVariants: [{ style: { fontWeight: 700 }, when: { tone: 'success' } }],
    selection: 'className',
    variants: { tone: { neutral: {}, success: { color: 'rgb(0, 170, 0)' } } },
  })

  export const quiet = style({ opacity: 1 })
}
`,
      )
      // A second module declares a body the first also declares, and keeps its own rule.
      await Fs.writeFile(
        Path.join(root, 'src/Note.tsx'),
        `import { style } from 'zyzz'

export function Note() {
  return <text {...styles.note()}>Note</text>
}

namespace styles {
  export const note = style({ opacity: 1 })
}
`,
      )

      // The composition reads the runtime helper, which the fixture resolves from the repository.
      const result = await (
        await create(root, {
          source: {
            alias: { 'zyzz/runtime': Path.resolve('src/runtime/index.ts') },
            entry: { main: './src/index.tsx' },
          },
          tools: {
            rspack: { resolve: { extensionAlias: { '.js': ['.ts', '.js'] } } },
          },
        })
      ).build()
      await result.close()

      // Every rule reaches the template with its declarations: one class per choice and
      // compound, at-rules outside the class, and composition copies under their own prefix.
      // Production names come from one dense table across both modules.
      const { css, mainThread } = await template(root)
      expect(css).toMatchInlineSnapshot(`
        [
          ".z0 { opacity: 1 }",
          ".z4 { padding: 2px }",
          ".zA10 { height: 40px }",
          "@media (width>=1px) { .zA10 { width: 40px } }",
          ".zA11 { height: 20px }",
          ".zA12 { color: #000 }",
          ".zA13 { color: #0a0 }",
          ".zA14 { opacity: .5 }",
          ".z5 { font-size: 12px }",
          ".zA21 { color: #0a0 }",
          ".zA22 { font-weight: 700 }",
          ".z6 { padding: 2px }",
          ".zA30 { height: 40px }",
          "@media (width>=1px) { .zA30 { width: 40px } }",
          ".zA31 { height: 20px }",
          ".zA32 { color: #000 }",
          ".zA33 { color: #0a0 }",
          ".zA34 { opacity: .5 }",
          ".z7 { opacity: 1 }",
        ]
      `)
      // The composition renames the recipe's choice classes to its own copies.
      expect(
        mainThread
          .replace(/\s+/g, '')
          .match(/"renames":\[\[\["[\w-]+","[\w-]+"\]\]\]/g),
      ).toMatchInlineSnapshot(`
        [
          ""renames":[[["zA1","zA3"]]]",
        ]
      `)
      // Every generated class the main thread adds, a unit or a choice class under a recipe
      // prefix, selects a rule of the template.
      const selectors = new Set(
        css.flatMap((rule) => rule.match(/\.z[0-9A-Za-z]+/g) ?? []),
      )
      const token = /z[0-9a-z]+|zA[0-9a-z]{2}/
      const lists = mainThread.match(
        new RegExp(`" ?${token.source}(?: ${token.source})*"`, 'g'),
      )
      const classes = [
        ...new Set(
          lists?.flatMap((list) => list.replaceAll('"', '').trim().split(' ')),
        ),
      ].sort()

      expect(classes).toMatchInlineSnapshot(`
        [
          "z0",
          "z4",
          "z5",
          "z6",
          "zA10",
          "zA11",
          "zA12",
          "zA13",
          "zA14",
          "zA21",
          "zA22",
        ]
      `)
      expect(classes.filter((name) => !selectors.has(`.${name}`))).toEqual([])
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('encodes pseudo-class, selector, and media conditions as flat rules', async () => {
    const root = await fixture()
    try {
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { style } from 'zyzz'

export function App() {
  return <view className="list"><view {...styles.remove()} /></view>
}

namespace styles {
  export const remove = style({
    opacity: 1,
    ':active': { opacity: 0.4 },
    '@media (min-width: 1px)': { '&:focus': { opacity: 0.6 } },
    selectors: { '.list > &': { marginTop: '1px' } },
  })
}
`,
      )

      const result = await (await create(root)).build()
      await result.close()

      // Each condition reaches the template as its own rule with its declarations.
      const { css } = await template(root)
      expect(css).toMatchInlineSnapshot(`
        [
          ".z0 { opacity: 1 }",
          ".z1:active { opacity: .4 }",
          "@media (width>=1px) { .z2:focus { opacity: .6 } }",
          ".list>.z3 { margin-top: 1px }",
        ]
      `)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('keeps line longhands apart from the inset shorthand', async () => {
    const root = await fixture()
    try {
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { style } from 'zyzz'

export function App() {
  return <view {...styles.backdrop()}><view {...styles.edge()} /></view>
}

namespace styles {
  export const backdrop = style({
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  })

  export const edge = style({
    bottom: 'auto',
    left: 'calc(100% - 8px)',
    right: '4px !important',
    top: 0,
  })
}
`,
      )

      const result = await (await create(root)).build()
      await result.close()

      // Lightning CSS merges four equal-importance sides into \`inset\`, which Lynx drops,
      // so the host restores the longhands in the encoded stylesheet.
      expect((await template(root)).css).toMatchInlineSnapshot(`
        [
          ".z0 { top: 0; right: 0; bottom: 0; left: 0 }",
          ".z1 { position: absolute }",
          ".z2 { top: 0; bottom: auto; left: calc(100% - 8px); right: 4px !important }",
        ]
      `)
    } finally {
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('rebuilds the zyzz.css module after a style edit in watch mode', async () => {
    const root = await fixture()
    const rspeedy = await create(root)
    let built: () => void = () => {}
    rspeedy.onAfterBuild(() => built())
    const next = () =>
      new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Rspeedy did not rebuild.')),
          20_000,
        )
        built = () => {
          clearTimeout(timeout)
          resolve()
        }
      })

    const initial = next()
    const result = await rspeedy.build({ watch: true })
    try {
      await initial

      const rebuilt = next()
      const file = Path.join(root, 'src/App.tsx')
      await Fs.writeFile(
        file,
        (await Fs.readFile(file, 'utf8')).replace(
          'rgb(0, 102, 204)',
          'rgb(255, 0, 0)',
        ),
      )
      await rebuilt

      expect((await template(root)).css).toMatchInlineSnapshot(`
        [
          ".z0 { background-color: red }",
          ".z1 { padding: 8px }",
          ".z2 { color: #fff }",
          ".z3 { font-size: 20px }",
        ]
      `)
    } finally {
      await result.close()
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)

  test('rebuilds after a style error is fixed in watch mode', async () => {
    const root = await fixture()
    const file = Path.join(root, 'src/App.tsx')
    const valid = await Fs.readFile(file, 'utf8')
    await Fs.writeFile(file, valid.replace("'8px'", "String(8) + 'px'"))

    const rspeedy = await create(root)
    let built: (errors: readonly string[]) => void = () => {}
    rspeedy.onAfterBuild((context) => {
      built(
        (context.stats?.toJson({ all: false, errors: true }).errors ?? []).map(
          (error) => error.message,
        ),
      )
    })
    const next = () =>
      new Promise<readonly string[]>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Rspeedy did not rebuild.')),
          20_000,
        )
        built = (errors) => {
          clearTimeout(timeout)
          resolve(errors)
        }
      })

    const initial = next()
    const result = await rspeedy.build({ watch: true })
    try {
      expect(
        (await initial).some((message) =>
          message.includes('Expected a literal string or number'),
        ),
      ).toMatchInlineSnapshot(`true`)

      const rebuilt = next()
      await Fs.writeFile(file, valid)

      expect(await rebuilt).toMatchInlineSnapshot(`[]`)
      expect((await template(root)).css).toMatchInlineSnapshot(`
        [
          ".z0 { background-color: #06c }",
          ".z1 { padding: 8px }",
          ".z2 { color: #fff }",
          ".z3 { font-size: 20px }",
        ]
      `)
    } finally {
      await result.close()
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)
})
