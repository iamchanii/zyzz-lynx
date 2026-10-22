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
})
