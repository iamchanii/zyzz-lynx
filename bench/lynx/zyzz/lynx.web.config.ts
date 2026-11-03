/**
 * Web variant of the sample configuration. The web environment emits a `product.web.bundle` that
 * `@lynx-js/web-core` renders in a browser, which the visual comparison in `../visual` screenshots.
 * It writes to `dist-web` so the measured Lynx build in `dist` stays untouched.
 * @module
 */
import { mergeRsbuildConfig } from '@rsbuild/core'
import base from './lynx.config.js'

export default mergeRsbuildConfig(base, {
  environments: { web: {} },
  output: { distPath: { root: 'dist-web' } },
})
