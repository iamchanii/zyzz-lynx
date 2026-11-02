/**
 * Design tokens of the job-post sample bound to the Zyzz authoring helpers. Components import
 * `style`, `variants`, and `vars` from this module, so a renamed token fails type checking at
 * every use.
 * @module
 */
import { defineConfig, defineVars } from 'zyzz'

// Theme data must be literal, so each preset repeats its scale step instead of spreading one.
const base = defineVars({
  color: {
    bg: {
      brandSolid: '#ff6f0f',
      brandWeak: '#fff5ec',
      criticalWeak: '#fdeaec',
      disabled: '#e8e9eb',
      informativeSolid: '#0b6bcb',
      informativeWeak: '#e9f3fe',
      layerBasement: '#f3f4f5',
      layerDefault: '#ffffff',
      layerFloating: '#ffffff',
      neutralInverted: '#1a1a1a',
      neutralMuted: '#e8e9eb',
      neutralWeak: '#f3f4f5',
      overlay: 'rgba(0, 0, 0, 0.5)',
      positiveWeak: '#e7f8ef',
      transparent: 'rgba(255, 255, 255, 0)',
    },
    fg: {
      brand: '#ff6f0f',
      critical: '#e81e2d',
      disabled: '#c3c6cc',
      informative: '#0b6bcb',
      neutral: '#1a1a1a',
      neutralInverted: '#ffffff',
      neutralMuted: '#555d6d',
      neutralSubtle: '#868b94',
      placeholder: '#adb1ba',
      positive: '#00a05b',
      staticWhite: '#ffffff',
    },
    palette: {
      blue900: '#0b4ea2',
      carrot500: '#ff6f0f',
      carrot600: '#e65c0a',
      carrot800: '#a63d00',
      gray00: '#ffffff',
      gray100: '#f7f8f9',
      gray1000: '#0b0b0c',
      gray200: '#e8e9eb',
      gray300: '#dcdee3',
      gray500: '#adb1ba',
      gray700: '#555d6d',
      gray800: '#3c4250',
      gray900: '#212124',
      green500: '#00a05b',
      purple100: '#f1ecfb',
      staticBlackAlpha500: 'rgba(0, 0, 0, 0.5)',
      staticWhiteAlpha700: 'rgba(255, 255, 255, 0.7)',
    },
    stroke: {
      brand: '#ff6f0f',
      neutral: '#adb1ba',
      neutralMuted: '#dcdee3',
      neutralSubtle: '#e8e9eb',
    },
  },
  typography: {
    t1Regular: { fontSize: '11px', fontWeight: 400, lineHeight: '14px' },
    t2Bold: { fontSize: '12px', fontWeight: 700, lineHeight: '16px' },
    t2Regular: { fontSize: '12px', fontWeight: 400, lineHeight: '16px' },
    t3Bold: { fontSize: '13px', fontWeight: 700, lineHeight: '18px' },
    t3Regular: { fontSize: '13px', fontWeight: 400, lineHeight: '18px' },
    t4Bold: { fontSize: '14px', fontWeight: 700, lineHeight: '19px' },
    t4Medium: { fontSize: '14px', fontWeight: 500, lineHeight: '19px' },
    t4Regular: { fontSize: '14px', fontWeight: 400, lineHeight: '19px' },
    t5Bold: { fontSize: '16px', fontWeight: 700, lineHeight: '22px' },
    t5Medium: { fontSize: '16px', fontWeight: 500, lineHeight: '22px' },
    t5Regular: { fontSize: '16px', fontWeight: 400, lineHeight: '22px' },
    t6Bold: { fontSize: '18px', fontWeight: 700, lineHeight: '24px' },
    t7Bold: { fontSize: '20px', fontWeight: 700, lineHeight: '28px' },
    t8Bold: { fontSize: '24px', fontWeight: 700, lineHeight: '32px' },
  },
})

export const { style, variants, vars } = defineConfig({ vars: base })
