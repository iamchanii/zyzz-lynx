/** Checks that the Rspeedy plugin fits Rspeedy configuration. @module */
import type { RsbuildPlugin } from '@rsbuild/core'
import { defineConfig } from '@lynx-js/rspeedy'
import { describe, expectTypeOf, test } from 'vite-plus/test'
import { zyzz } from 'zyzz/rspeedy'

describe('zyzz', () => {
  test('returns an Rsbuild plugin accepted by Rspeedy', () => {
    expectTypeOf(
      zyzz({ reset: true, root: 'src' }),
    ).toEqualTypeOf<RsbuildPlugin>()

    defineConfig({ plugins: [zyzz()] })

    // @ts-expect-error Portable adapters compile web output.
    zyzz({ native: { platform: 'ios', colorScheme: 'dark' } })
  })
})
