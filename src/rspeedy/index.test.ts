/** Builds ReactLynx applications with Rspeedy and inspects the encoded Lynx stylesheet. @module */
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { createRspeedy } from '@lynx-js/rspeedy'
import * as Fs from 'node:fs/promises'
import * as Path from 'node:path'
import { describe, expect, test } from 'vite-plus/test'
import { zyzz } from 'zyzz/rspeedy'

type Template = {
  readonly css: {
    readonly cssMap: Readonly<
      Record<
        string,
        readonly {
          readonly selectorText: { readonly value: string }
          readonly style: readonly {
            readonly name: string
            readonly value: string
          }[]
        }[]
      >
    >
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

async function create(root: string) {
  return createRspeedy({
    cwd: root,
    loadEnv: false,
    rspeedyConfig: {
      // Development builds write the encoded template to `tasm.json`.
      mode: 'development',
      plugins: [pluginReactLynx(), zyzz()],
      source: { entry: { main: './src/index.tsx' } },
    },
  })
}

async function template(root: string) {
  const template = JSON.parse(
    await Fs.readFile(Path.join(root, 'dist/.lynx/main/tasm.json'), 'utf8'),
  ) as Template

  return {
    css: Object.values(template.css.cssMap)
      .flat()
      .map(
        (rule) =>
          `${rule.selectorText.value} { ${rule.style.map((declaration) => `${declaration.name}: ${declaration.value}`).join('; ')} }`,
      ),
    mainThread: template.lepusCode.root,
  }
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
          ".z_i6Fywm0 { background-color: #06c }",
          ".z_i6Fywm1 { padding: 8px }",
          ".z_i6Fywm2 { color: #fff }",
          ".z_i6Fywm3 { font-size: 20px }",
        ]
      `)
      expect(mainThread.match(/"z_[\w-]+ z_[\w-]+"/g)).toMatchInlineSnapshot(`
        [
          ""z_i6Fywm0 z_i6Fywm1"",
          ""z_i6Fywm2 z_i6Fywm3"",
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
          ".z_i6Fywm0 { background-color: {{--seed-color-bg-layer-default}} }",
          ".z_i6Fywm1 { border-color: {{--seed-color-bg-layer-floating}} }",
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

  test('encodes class-selection variants as flat choice rules', async () => {
    const root = await fixture()
    try {
      await Fs.writeFile(
        Path.join(root, 'src/App.tsx'),
        `import { variants } from 'zyzz'\n\nexport function App(props: { tone?: 'neutral' | 'success' }) {\n  return <view {...badge({ size: 'large', tone: props.tone })} />\n}\n\nconst badge = variants({\n  base: { padding: '2px' },\n  compoundVariants: [{ style: { opacity: 0.5 }, when: { size: ['large', 'small'], tone: 'success' } }],\n  defaultVariants: { tone: 'neutral' },\n  selection: 'class',\n  variants: {\n    size: { large: { height: '40px' }, small: { height: '20px' } },\n    tone: { neutral: { color: 'rgb(0, 0, 0)' }, success: { color: 'rgb(0, 170, 0)' } },\n  },\n})\n`,
      )

      const result = await (await create(root)).build()
      await result.close()

      // The template encoder drops nested rules and `:where()` selectors.
      const { css, mainThread } = await template(root)
      expect(css).toMatchInlineSnapshot(`
        [
          ".z_i6Fywm0 { padding: 2px }",
          ".zveWCW2ABL0 { height: 40px }",
          ".zveWCW2ABL1 { height: 20px }",
          ".zveWCW2ABL2 { color: #000 }",
          ".zveWCW2ABL3 { color: #0a0 }",
          ".zveWCW2ABL0.zveWCW2ABL3,.zveWCW2ABL1.zveWCW2ABL3 { opacity: .5 }",
        ]
      `)
      expect(mainThread.match(/" zveWCW2ABL\d"/g)).toMatchInlineSnapshot(`
        [
          "" zveWCW2ABL0"",
          "" zveWCW2ABL1"",
          "" zveWCW2ABL2"",
          "" zveWCW2ABL3"",
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
          ".z_i6Fywm0 { background-color: red }",
          ".z_i6Fywm1 { padding: 8px }",
          ".z_i6Fywm2 { color: #fff }",
          ".z_i6Fywm3 { font-size: 20px }",
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
          ".z_i6Fywm0 { background-color: #06c }",
          ".z_i6Fywm1 { padding: 8px }",
          ".z_i6Fywm2 { color: #fff }",
          ".z_i6Fywm3 { font-size: 20px }",
        ]
      `)
    } finally {
      await result.close()
      await Fs.rm(root, { force: true, recursive: true })
    }
  }, 60_000)
})
