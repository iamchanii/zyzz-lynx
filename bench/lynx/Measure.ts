/**
 * Builds the Lynx sample applications with Rspeedy and records the shipped bundle, the split
 * chunks, the encoded stylesheet, and the per-thread intermediate scripts.
 *
 * Every sample builds twice: a plain production build measures `<entry>.lynx.bundle` and the
 * external chunks the way a device downloads them, and a `DEBUG=rspeedy` production build keeps
 * the intermediate `.lynx/<entry>/` assets, `tasm.json`, and `stats.json` that the encoder
 * otherwise deletes. Results land under `bench/results/lynx/<label>/<app>.json`, and the summary
 * prints as a Markdown table.
 *
 * ```sh
 * node bench/lynx/Measure.ts --label main --app ve --app zyzz
 * ```
 *
 * `--library <dir>` points the `zyzz` sample at another checkout of this repository for the
 * duration of the run, such as a worktree at an earlier commit with its own `dist` and binding,
 * and restores the workspace link afterwards.
 * @module
 */
import * as ChildProcess from 'node:child_process'
import * as Fs from 'node:fs'
import * as Path from 'node:path'
import * as Util from 'node:util'
import * as Zlib from 'node:zlib'

const root = Path.resolve(import.meta.dirname)
const repository = Path.resolve(root, '../..')

const { values } = Util.parseArgs({
  options: {
    app: { multiple: true, short: 'a', type: 'string' },
    label: { short: 'l', type: 'string' },
    library: { type: 'string' },
    out: { short: 'o', type: 'string' },
  },
})

const apps = values.app ?? ['ve', 'zyzz']
const label = values.label ?? new Date().toISOString().replaceAll(/[:.]/g, '-')
const out = Path.resolve(
  values.out ?? Path.join(repository, 'bench/results/lynx'),
  label,
)
const link = Path.join(root, 'zyzz/node_modules/zyzz')
const original = Fs.readlinkSync(link)

Fs.mkdirSync(out, { recursive: true })
if (values.library) relink(Path.resolve(values.library))

try {
  const results = apps.map((app) => {
    const result = measure(Path.join(root, app), app)
    Fs.writeFileSync(
      Path.join(out, `${app}.json`),
      `${JSON.stringify(result, null, 2)}\n`,
    )
    return result
  })

  console.log(report(results))
  Fs.writeFileSync(Path.join(out, 'README.md'), `${report(results)}\n`)
} finally {
  if (values.library) relink(original)
}

/** Points the zyzz sample's `zyzz` dependency at `target`, a checkout with `dist` and a binding. */
function relink(target: string): void {
  Fs.rmSync(link)
  Fs.symlinkSync(target, link)
}

/** Builds one sample twice and collects every size that the comparison tracks. */
function measure(directory: string, app: string): measure.Result {
  const dist = Path.join(directory, 'dist')
  const entry = ((): string => {
    build(directory, false)
    const bundle = Fs.readdirSync(dist).find((file) =>
      file.endsWith('.lynx.bundle'),
    )
    if (!bundle) throw new Error(`${app}: no .lynx.bundle in ${dist}`)
    return bundle.slice(0, -'.lynx.bundle'.length)
  })()

  const bundle = sizes(Path.join(dist, `${entry}.lynx.bundle`))
  const chunks = files(Path.join(dist, 'static'))
    .filter((file) => file.endsWith('.js'))
    .map((file) => ({ name: Path.relative(dist, file), ...sizes(file) }))

  build(directory, true)
  const intermediate = Path.join(dist, '.lynx', entry)
  const background = Fs.readdirSync(intermediate).find((file) =>
    /^background\..*\.js$/.test(file),
  )
  const css = Path.join(intermediate, `${entry}.css`)

  return {
    app,
    bundle,
    chunks,
    css: template(Path.join(intermediate, 'tasm.json')),
    intermediate: {
      background: background
        ? sizes(Path.join(intermediate, background))
        : undefined,
      css: Fs.existsSync(css) ? sizes(css) : undefined,
      debugBundle: sizes(Path.join(dist, `${entry}.lynx.bundle`)),
      mainThread: sizes(Path.join(intermediate, 'main-thread.js')),
    },
    label,
    modules: modules(Path.join(dist, 'stats.json'), directory),
    source: source(directory, app),
  }
}

declare namespace measure {
  type Result = {
    readonly app: string
    readonly bundle: sizes.Sizes
    readonly chunks: readonly (sizes.Sizes & { readonly name: string })[]
    readonly css: template.Css
    readonly intermediate: {
      readonly background: sizes.Sizes | undefined
      readonly css: sizes.Sizes | undefined
      readonly debugBundle: sizes.Sizes
      readonly mainThread: sizes.Sizes
    }
    readonly label: string
    readonly modules: modules.Modules
    readonly source: source.Source
  }
}

/** Runs a production Rspeedy build in `directory`, keeping intermediates when `debug` is set. */
function build(directory: string, debug: boolean): void {
  Fs.rmSync(Path.join(directory, 'dist'), { force: true, recursive: true })

  const result = ChildProcess.spawnSync(
    process.execPath,
    [
      Path.join(directory, 'node_modules/@lynx-js/rspeedy/bin/rspeedy.js'),
      'build',
    ],
    {
      cwd: directory,
      encoding: 'utf8',
      env: {
        ...process.env,
        ...(debug ? { DEBUG: 'rspeedy' } : {}),
        NODE_OPTIONS: '--no-deprecation',
      },
    },
  )
  if (result.status !== 0)
    throw new Error(
      `rspeedy build failed in ${directory}\n${result.stdout}\n${result.stderr}`,
    )
}

/** Lists every file below `directory`, or nothing when it does not exist. */
function files(directory: string): readonly string[] {
  if (!Fs.existsSync(directory)) return []
  return Fs.readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => Path.join(entry.parentPath, entry.name))
    .sort()
}

/** Raw, gzip, and Brotli byte counts of one file. */
function sizes(file: string): sizes.Sizes {
  const content = Fs.readFileSync(file)
  return {
    brotli: Zlib.brotliCompressSync(content).byteLength,
    gzip: Zlib.gzipSync(content, { level: 9 }).byteLength,
    raw: content.byteLength,
  }
}

declare namespace sizes {
  type Sizes = {
    readonly brotli: number
    readonly gzip: number
    readonly raw: number
  }
}

/**
 * Summarizes the stylesheet the encoder kept in the template, flattening `@media` wrappers so
 * every style rule counts once.
 */
function template(file: string): template.Css {
  const tasm = JSON.parse(Fs.readFileSync(file, 'utf8')) as template.Template
  const rules = Object.values(tasm.css.cssMap).flat()
  const flat = rules.flatMap(function visit(rule): readonly template.Rule[] {
    return rule.type === 'MediaRule' ? rule.rules.flatMap(visit) : [rule]
  })
  const style = flat.filter(
    (rule) => rule.type === undefined || rule.type === 'StyleRule',
  )
  const serialized = rules.map(print).join('\n')
  const classes = new Set(
    style.flatMap((rule) => rule.selectorText?.value.match(/\.[\w-]+/g) ?? []),
  )

  return {
    classes: classes.size,
    declarations: style.reduce(
      (total, rule) => total + (rule.style?.length ?? 0),
      0,
    ),
    keyframes: flat.filter((rule) => rule.type === 'KeyframesRule').length,
    media: rules.filter((rule) => rule.type === 'MediaRule').length,
    other: flat.filter(
      (rule) =>
        rule.type !== undefined &&
        rule.type !== 'StyleRule' &&
        rule.type !== 'KeyframesRule',
    ).length,
    rules: style.length,
    selectorBytes: style.reduce(
      (total, rule) =>
        total + Buffer.byteLength(rule.selectorText?.value ?? ''),
      0,
    ),
    serialized: {
      brotli: Zlib.brotliCompressSync(serialized).byteLength,
      gzip: Zlib.gzipSync(serialized, { level: 9 }).byteLength,
      raw: Buffer.byteLength(serialized),
    },
    templateMainThread: Buffer.byteLength(tasm.lepusCode.root),
  }

  function print(rule: template.Rule): string {
    if (rule.type === 'MediaRule')
      return `@media ${rule.prelude?.value ?? ''}{${rule.rules.map(print).join('')}}`
    if (rule.type === 'KeyframesRule')
      return `@keyframes ${rule.name ?? ''}{${JSON.stringify(rule.styles ?? rule.keyframes ?? {})}}`
    const declarations = (rule.style ?? [])
      .map((declaration) => `${declaration.name}:${declaration.value}`)
      .join(';')
    return `${rule.selectorText?.value ?? ''}{${declarations}}`
  }
}

declare namespace template {
  type Rule = {
    readonly keyframes?: unknown
    readonly name?: string
    readonly prelude?: { readonly value: string }
    readonly rules: readonly Rule[]
    readonly selectorText?: { readonly value: string }
    readonly style?: readonly {
      readonly name: string
      readonly value: string
    }[]
    readonly styles?: unknown
    readonly type?: string
  }
  type Template = {
    readonly css: { readonly cssMap: Readonly<Record<string, readonly Rule[]>> }
    readonly lepusCode: { readonly root: string }
  }
  type Css = {
    readonly classes: number
    readonly declarations: number
    readonly keyframes: number
    readonly media: number
    readonly other: number
    readonly rules: number
    readonly selectorBytes: number
    readonly serialized: sizes.Sizes
    readonly templateMainThread: number
  }
}

/** Groups the Rspack module sizes by thread layer and by application or dependency origin. */
function modules(file: string, directory: string): modules.Modules {
  const stats = JSON.parse(Fs.readFileSync(file, 'utf8')) as modules.Stats
  const all = (function collect(
    node: modules.Stats,
  ): readonly modules.Module[] {
    // Child compilations, such as vanilla-extract's, build nothing that ships.
    return node.modules?.length
      ? node.modules
      : (node.children ?? []).flatMap(collect)
  })(stats)
  const seen = new Set<string>()
  const layers: Record<string, modules.Layer> = {}
  const largest: modules.Module[] = []

  for (const module of all) {
    const key = `${module.layer ?? ''}:${module.identifier ?? module.name}`
    if (seen.has(key) || module.modules) continue
    seen.add(key)

    const layer = module.layer ?? 'runtime'
    const group = (layers[layer] ??= {
      application: 0,
      dependencies: 0,
      modules: 0,
      styles: 0,
    })
    const name = module.name ?? ''
    group.modules += 1
    if (/node_modules|^webpack\//.test(name)) group.dependencies += module.size
    else if (/\.css(\.ts)?(\?|!|$)|zyzz\.css|vanilla/.test(name))
      group.styles += module.size
    else group.application += module.size

    if (!/node_modules|^webpack\//.test(name)) largest.push(module)
  }

  largest.sort((left, right) => right.size - left.size)

  return {
    largest: largest.slice(0, 15).map((module) => ({
      layer: module.layer ?? 'runtime',
      name: (module.name ?? '').replace(directory, '.'),
      size: module.size,
    })),
    layers,
  }
}

declare namespace modules {
  type Module = {
    readonly identifier?: string
    readonly layer?: string | null
    readonly modules?: readonly Module[]
    readonly name?: string
    readonly size: number
  }
  type Stats = {
    readonly children?: readonly Stats[]
    readonly modules?: readonly Module[]
  }
  type Layer = {
    application: number
    dependencies: number
    modules: number
    styles: number
  }
  type Modules = {
    readonly largest: readonly {
      readonly layer: string
      readonly name: string
      readonly size: number
    }[]
    readonly layers: Readonly<Record<string, Layer>>
  }
}

/** Records which library build produced the result, so a row can be tied to a commit. */
function source(directory: string, app: string): source.Source {
  const library = ((): string | undefined => {
    const link = Path.join(
      directory,
      'node_modules',
      app === 'zyzz' ? 'zyzz' : '@vanilla-extract/css',
    )
    return Fs.existsSync(link) ? Fs.realpathSync(link) : undefined
  })()
  const commit = ((): string | undefined => {
    if (!library || app !== 'zyzz') return undefined
    const result = ChildProcess.spawnSync(
      'git',
      ['rev-parse', '--short', 'HEAD'],
      {
        cwd: library,
        encoding: 'utf8',
      },
    )
    return result.status === 0 ? result.stdout.trim() : undefined
  })()

  return { commit, library }
}

declare namespace source {
  type Source = {
    readonly commit: string | undefined
    readonly library: string | undefined
  }
}

/** Formats the measured samples side by side. */
function report(results: readonly measure.Result[]): string {
  const row = (
    name: string,
    pick: (result: measure.Result) => string,
  ): string => `| ${name} | ${results.map(pick).join(' | ')} |`
  const kb = (bytes: number | undefined): string =>
    bytes === undefined ? '-' : `${(bytes / 1024).toFixed(1)} kB`
  const triple = (size: sizes.Sizes | undefined): string =>
    size ? `${kb(size.raw)} / ${kb(size.gzip)} / ${kb(size.brotli)}` : '-'
  const layer = (
    result: measure.Result,
    name: string,
  ): modules.Layer | undefined =>
    Object.entries(result.modules.layers).find(([key]) =>
      key.includes(name),
    )?.[1]

  return [
    `| Metric | ${results.map((result) => result.app).join(' | ')} |`,
    `| --- | ${results.map(() => '---').join(' | ')} |`,
    row('Library commit', (result) => result.source.commit ?? '-'),
    row('.lynx.bundle', (result) => kb(result.bundle.raw)),
    row('External chunks (raw / gzip / br)', (result) =>
      triple({
        brotli: result.chunks.reduce((total, chunk) => total + chunk.brotli, 0),
        gzip: result.chunks.reduce((total, chunk) => total + chunk.gzip, 0),
        raw: result.chunks.reduce((total, chunk) => total + chunk.raw, 0),
      }),
    ),
    row('main-thread.js (raw / gzip / br)', (result) =>
      triple(result.intermediate.mainThread),
    ),
    row('background.js (raw / gzip / br)', (result) =>
      triple(result.intermediate.background),
    ),
    row('CSS asset (raw / gzip / br)', (result) =>
      triple(result.intermediate.css),
    ),
    row('Encoded CSS (raw / gzip / br)', (result) =>
      triple(result.css.serialized),
    ),
    row(
      'CSS rules / declarations / classes',
      (result) =>
        `${result.css.rules} / ${result.css.declarations} / ${result.css.classes}`,
    ),
    row(
      'CSS @media / @keyframes',
      (result) => `${result.css.media} / ${result.css.keyframes}`,
    ),
    row('Main-thread app / styles / deps', (result) => {
      const group = layer(result, 'main-thread')
      return group
        ? `${kb(group.application)} / ${kb(group.styles)} / ${kb(group.dependencies)}`
        : '-'
    }),
    row('Background app / styles / deps', (result) => {
      const group = layer(result, 'background')
      return group
        ? `${kb(group.application)} / ${kb(group.styles)} / ${kb(group.dependencies)}`
        : '-'
    }),
  ].join('\n')
}
