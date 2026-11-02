/**
 * Analysis variant of the Zyzz sample configuration. Named module ids and disabled scope hoisting
 * keep every module's importer visible in the output and in `stats.json`, at the cost of size, so
 * this build is for tracing module graphs only.
 * @module
 */
import { mergeRsbuildConfig } from '@rsbuild/core'
import base from './lynx.config.js'

export default mergeRsbuildConfig(base, {
  tools: {
    rspack: {
      optimization: { concatenateModules: false, moduleIds: 'named' },
    },
  },
})
