/** Rspeedy configuration for the Zyzz sample of the Lynx bundle comparison. @module */
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { defineConfig } from '@lynx-js/rspeedy'
import { zyzz } from 'zyzz/rspeedy'

// Both samples share these ReactLynx and chunk settings, mirroring a production Lynx app.
export default defineConfig({
  performance: { chunkSplit: { strategy: 'split-by-module' } },
  plugins: [
    pluginReactLynx({ enableCSSInvalidation: true, enableCSSSelector: true }),
    zyzz({ root: 'src' }),
  ],
  source: { entry: { jobPost: './src/index.tsx' } },
})
