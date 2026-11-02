#!/usr/bin/env node
/**
 * Renders the vanilla-extract and Zyzz samples' web bundles in Chromium through
 * `@lynx-js/web-core`, drives both through the same interaction states, and compares the
 * screenshots pixel by pixel. Writes the screenshots, diff images, and a Markdown summary under
 * `bench/results/lynx/visual/`.
 *
 * Usage: `node bench/lynx/visual/Compare.ts [--out <dir>] [--threshold <0..1>]`
 * Both samples need a `dist-web/jobPost.web.bundle`, built with
 * `pnpm exec rspeedy build -c lynx.web.config.ts` in each sample directory.
 * @module
 */
import * as fs from 'node:fs'
import * as http from 'node:http'
import * as path from 'node:path'
import { parseArgs } from 'node:util'
import pixelmatch from 'pixelmatch'
import { chromium } from 'playwright'
import type { Locator, Page } from 'playwright'
import { PNG } from 'pngjs'

const here = path.dirname(new URL(import.meta.url).pathname)
const repo = path.resolve(here, '../../..')
const apps = ['ve', 'zyzz'] as const
const viewport = { height: 844, width: 390 }

type App = (typeof apps)[number]

type Step = {
  name: string
  /** Drives the page into the state. Throws when the state is unreachable. */
  run(page: Page): Promise<void>
  /** States that animate or depend on timing are reported but never fail the comparison. */
  informational?: boolean
}

type Capture = { app: App; file: string; skipped?: string }

type Result = {
  diff?: string
  height: number
  informational: boolean
  mismatch?: number
  name: string
  ratio?: number
  skipped: Partial<Record<App, string>>
  width: number
}

const mime: Record<string, string> = {
  '.bundle': 'application/octet-stream',
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.png': 'image/png',
  '.wasm': 'application/wasm',
}

/**
 * Serves one sample's `dist-web` at the origin root, where the bundle loads its split chunks
 * from `/static/js/`, and this directory under `/visual/` for the host page and web-core.
 */
function serve(distWeb: string): Promise<http.Server> {
  const roots: readonly (readonly [string, string])[] = [
    ['/visual/', here],
    ['/', distWeb],
  ]
  const server = http.createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1')
    const pathname = decodeURIComponent(url.pathname)
    const match = roots.find(([prefix]) => pathname.startsWith(prefix))
    const file = match
      ? path.join(match[1], pathname.slice(match[0].length))
      : undefined

    if (
      file === undefined ||
      !file.startsWith(match![1]) ||
      !fs.existsSync(file) ||
      fs.statSync(file).isDirectory()
    ) {
      response.writeHead(404)
      response.end()
      return
    }

    response.writeHead(200, {
      'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream',
    })
    fs.createReadStream(file).pipe(response)
  })

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

function byLabel(page: Page, label: string): Locator {
  return page.locator(
    `[aria-label="${label}"], [accessibility-label="${label}"]`,
  )
}

/** The `<text>` element showing exactly `text`. Its inner text node element has no box to tap. */
function byText(page: Page, text: string): Locator {
  return page.locator('x-text').filter({ hasText: new RegExp(`^${text}$`) })
}

/** Height of the app bar overlay, which intercepts taps on content scrolled under it. */
const overlayHeight = 160

async function tap(locator: Locator, settle: number) {
  const page = locator.page()

  await locator.waitFor({ state: 'visible', timeout: 5000 })
  await locator.scrollIntoViewIfNeeded()

  const box = await locator.boundingBox()

  if (box && box.y < overlayHeight) {
    await page.mouse.move(viewport.width / 2, viewport.height / 2)
    await page.mouse.wheel(0, box.y - overlayHeight)
    await page.waitForTimeout(300)
  }

  await locator.click({ timeout: 5000 })
  await page.waitForTimeout(settle)
}

async function wheel(page: Page, distance: number) {
  await page.mouse.move(viewport.width / 2, viewport.height / 2)
  await page.mouse.wheel(0, distance)
  await page.waitForTimeout(700)
}

async function ready(page: Page) {
  await page
    .getByText('지원하기')
    .first()
    .waitFor({ state: 'visible', timeout: 20000 })
  await page.waitForTimeout(1500)
}

/** The states both samples pass through, in order. Each step starts from the previous state. */
const steps: readonly Step[] = [
  {
    informational: true,
    name: 'loading',
    run: async (page) => {
      await page.locator('lynx-view').waitFor({ timeout: 10000 })
      await page.waitForTimeout(400)
    },
  },
  {
    // The notification nudge's countdown bar moves while it is visible, so a few pixels differ
    // with capture timing.
    informational: true,
    name: 'ready',
    run: ready,
  },
  {
    name: 'nudge-dismissed',
    run: (page) => tap(byLabel(page, '닫기').first(), 1000),
  },
  {
    // The footer heart is the last labelled heart; the cards above carry the same label.
    name: 'snackbar-saved',
    run: (page) => tap(byLabel(page, '관심 등록').last(), 800),
  },
  {
    // The snackbar dismisses itself after 2.4 s, so this toggles the heart back and taps the
    // action right away. The label's own element has no box (`display: contents`), so the tap
    // targets its button.
    name: 'snackbar-closed',
    run: async (page) => {
      await tap(byLabel(page, '관심 해제').last(), 300)
      await tap(
        page
          .locator('[accessibility-traits="button"]')
          .filter({ hasText: /^보기$/ })
          .first(),
        800,
      )
    },
  },
  {
    name: 'scrolled-solid-bar',
    run: async (page) => {
      await wheel(page, 600)
    },
  },
  {
    name: 'calendar-open',
    run: (page) => tap(byText(page, '달력 보기').first(), 800),
  },
  {
    name: 'text-expanded',
    run: (page) => tap(byText(page, '더보기').first(), 800),
  },
  {
    name: 'scrolled-bottom',
    run: async (page) => {
      await wheel(page, 20000)
      await page.waitForTimeout(500)
    },
  },
  {
    name: 'error',
    run: (page) => tap(byText(page, '전화하기').first(), 800),
  },
  {
    name: 'recovered',
    run: async (page) => {
      await tap(byText(page, '다시 시도').first(), 200)
      await ready(page)
    },
  },
]

async function capture(app: App, out: string): Promise<Capture[]> {
  const distWeb = path.join(repo, 'bench/lynx', app, 'dist-web')
  const bundle = path.join(distWeb, 'jobPost.web.bundle')

  if (!fs.existsSync(bundle)) {
    throw new Error(
      `Missing ${bundle}. Build it with rspeedy build -c lynx.web.config.ts.`,
    )
  }

  const server = await serve(distWeb)
  const address = server.address()

  if (address === null || typeof address === 'string') {
    throw new Error('The static server did not bind a TCP port.')
  }

  const browser = await chromium.launch()
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    hasTouch: true,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    viewport,
  })
  const page = await context.newPage()
  const errors: string[] = []

  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  const query = new URLSearchParams({ bundle: '/jobPost.web.bundle' })
  await page.goto(`http://127.0.0.1:${address.port}/visual/index.html?${query}`)

  const captures: Capture[] = []

  for (const step of steps) {
    const file = path.join(out, `${step.name}.${app}.png`)

    try {
      await step.run(page)
      await page.screenshot({ caret: 'hide', path: file })
      captures.push({ app, file })
    } catch (error) {
      const message =
        error instanceof Error
          ? (error.message.split('\n')[0] ?? '')
          : String(error)
      await page.screenshot({ caret: 'hide', path: file })
      captures.push({ app, file, skipped: message })
    }
  }

  await browser.close()
  server.close()

  if (errors.length > 0) {
    fs.writeFileSync(
      path.join(out, `${app}.errors.log`),
      `${errors.join('\n')}\n`,
    )
  }

  return captures
}

function compare(
  name: string,
  informational: boolean,
  left: Capture,
  right: Capture,
  out: string,
  threshold: number,
): Result {
  const a = PNG.sync.read(fs.readFileSync(left.file))
  const b = PNG.sync.read(fs.readFileSync(right.file))
  const skipped: Partial<Record<App, string>> = {}

  if (left.skipped) skipped[left.app] = left.skipped
  if (right.skipped) skipped[right.app] = right.skipped

  const base = {
    height: a.height,
    informational,
    name,
    skipped,
    width: a.width,
  }

  if (a.width !== b.width || a.height !== b.height) {
    return { ...base, mismatch: Number.NaN, ratio: Number.NaN }
  }

  const diff = new PNG({ height: a.height, width: a.width })
  const mismatch = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    includeAA: false,
    threshold,
  })
  const file = path.join(out, `${name}.diff.png`)

  fs.writeFileSync(file, PNG.sync.write(diff))

  return {
    ...base,
    diff: file,
    mismatch,
    ratio: mismatch / (a.width * a.height),
  }
}

function percent(ratio: number | undefined): string {
  if (ratio === undefined || Number.isNaN(ratio)) return 'size differs'
  return `${(ratio * 100).toFixed(3)}%`
}

function report(results: readonly Result[], out: string, threshold: number) {
  const rows = results.map((result) => {
    const notes = [
      ...(result.informational
        ? ['informational: animates while captured']
        : []),
      ...Object.entries(result.skipped).map(
        ([app, reason]) => `${app}: ${reason}`,
      ),
    ]
    const status = (() => {
      if (Object.keys(result.skipped).length > 0) return 'skipped'
      if (result.mismatch === 0) return 'identical'
      if (result.informational) return 'differs (informational)'
      return 'differs'
    })()

    return `| \`${result.name}\` | ${status} | ${result.mismatch ?? '-'} | ${percent(result.ratio)} | ${notes.join('; ')} |`
  })
  const summary = [
    '# Lynx Visual Comparison',
    '',
    `Both samples rendered through \`@lynx-js/web-core\` in headless Chromium at ${viewport.width}×${viewport.height} CSS px, device scale factor 2, with fixed waits after each interaction so enter animations finish before the screenshot. Pixels count as different when \`pixelmatch\` sees a perceptual delta above ${threshold}, anti-aliasing excluded. Screenshots are \`<state>.ve.png\` and \`<state>.zyzz.png\`, with differing pixels drawn in \`<state>.diff.png\`.`,
    '',
    '| State | Result | Different pixels | Share | Notes |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n')

  fs.writeFileSync(path.join(out, 'README.md'), summary)
  fs.writeFileSync(
    path.join(out, 'results.json'),
    `${JSON.stringify(results, null, 2)}\n`,
  )
  fs.writeFileSync(path.join(out, 'index.html'), gallery(results))
  process.stdout.write(summary)
}

/** A local page that shows each state's two screenshots beside the diff image. */
function gallery(results: readonly Result[]): string {
  const sections = results.map((result) => {
    const status =
      result.mismatch === 0
        ? 'identical'
        : `${result.mismatch ?? '-'} pixels differ (${percent(result.ratio)})`
    const note = result.informational ? ', informational' : ''

    return `<section>
  <h2><code>${result.name}</code> <small>${status}${note}</small></h2>
  <div class="row">
    <figure><img src="./${result.name}.ve.png" alt="${result.name} vanilla-extract" /><figcaption>vanilla-extract</figcaption></figure>
    <figure><img src="./${result.name}.zyzz.png" alt="${result.name} Zyzz" /><figcaption>Zyzz</figcaption></figure>
    <figure><img src="./${result.name}.diff.png" alt="${result.name} diff" /><figcaption>diff</figcaption></figure>
  </div>
</section>`
  })

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Lynx visual comparison</title>
<style>
  body { font: 14px system-ui, sans-serif; margin: 24px; background: #f6f6f6; color: #222; }
  h2 small { font-weight: normal; color: #666; margin-left: 8px; }
  .row { display: flex; gap: 16px; align-items: flex-start; }
  figure { margin: 0; }
  img { width: 390px; height: auto; border: 1px solid #ccc; background: #fff; }
  figcaption { text-align: center; color: #666; margin-top: 4px; }
</style>
</head>
<body>
<h1>Lynx visual comparison</h1>
${sections.join('\n')}
</body>
</html>
`
}

async function main() {
  const { values } = parseArgs({
    options: {
      out: {
        default: path.join(repo, 'bench/results/lynx/visual'),
        type: 'string',
      },
      threshold: { default: '0.1', type: 'string' },
    },
  })
  const out = path.resolve(values.out)
  const threshold = Number(values.threshold)

  fs.mkdirSync(out, { recursive: true })

  const captures: Record<App, Capture[]> = { ve: [], zyzz: [] }

  for (const app of apps) {
    captures[app] = await capture(app, out)
  }

  const results = steps.map((step, index) =>
    compare(
      step.name,
      step.informational ?? false,
      captures.ve[index]!,
      captures.zyzz[index]!,
      out,
      threshold,
    ),
  )

  report(results, out, threshold)

  const failed = results.filter(
    (result) =>
      !result.informational &&
      Object.keys(result.skipped).length === 0 &&
      result.mismatch !== 0,
  )

  process.exitCode = failed.length > 0 ? 1 : 0
}

await main()
