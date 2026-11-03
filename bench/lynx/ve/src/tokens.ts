/**
 * Typed references to the design-token custom properties declared in `tokens.css`, plus the
 * typography presets that style modules spread into text declarations.
 * @module
 */

export const vars = {
  color: {
    bg: {
      brandSolid: 'var(--base-color-bg-brand-solid)',
      brandWeak: 'var(--base-color-bg-brand-weak)',
      criticalWeak: 'var(--base-color-bg-critical-weak)',
      disabled: 'var(--base-color-bg-disabled)',
      informativeSolid: 'var(--base-color-bg-informative-solid)',
      informativeWeak: 'var(--base-color-bg-informative-weak)',
      layerBasement: 'var(--base-color-bg-layer-basement)',
      layerDefault: 'var(--base-color-bg-layer-default)',
      layerFloating: 'var(--base-color-bg-layer-floating)',
      neutralInverted: 'var(--base-color-bg-neutral-inverted)',
      neutralMuted: 'var(--base-color-bg-neutral-muted)',
      neutralWeak: 'var(--base-color-bg-neutral-weak)',
      overlay: 'var(--base-color-bg-overlay)',
      positiveWeak: 'var(--base-color-bg-positive-weak)',
      transparent: 'var(--base-color-bg-transparent)',
    },
    fg: {
      brand: 'var(--base-color-fg-brand)',
      critical: 'var(--base-color-fg-critical)',
      disabled: 'var(--base-color-fg-disabled)',
      informative: 'var(--base-color-fg-informative)',
      neutral: 'var(--base-color-fg-neutral)',
      neutralInverted: 'var(--base-color-fg-neutral-inverted)',
      neutralMuted: 'var(--base-color-fg-neutral-muted)',
      neutralSubtle: 'var(--base-color-fg-neutral-subtle)',
      placeholder: 'var(--base-color-fg-placeholder)',
      positive: 'var(--base-color-fg-positive)',
      staticWhite: 'var(--base-color-fg-static-white)',
    },
    palette: {
      blue900: 'var(--base-color-palette-blue900)',
      carrot500: 'var(--base-color-palette-carrot500)',
      carrot600: 'var(--base-color-palette-carrot600)',
      carrot800: 'var(--base-color-palette-carrot800)',
      gray00: 'var(--base-color-palette-gray00)',
      gray100: 'var(--base-color-palette-gray100)',
      gray1000: 'var(--base-color-palette-gray1000)',
      gray200: 'var(--base-color-palette-gray200)',
      gray300: 'var(--base-color-palette-gray300)',
      gray500: 'var(--base-color-palette-gray500)',
      gray700: 'var(--base-color-palette-gray700)',
      gray800: 'var(--base-color-palette-gray800)',
      gray900: 'var(--base-color-palette-gray900)',
      green500: 'var(--base-color-palette-green500)',
      purple100: 'var(--base-color-palette-purple100)',
      staticBlackAlpha500: 'var(--base-color-palette-static-black-alpha500)',
      staticWhiteAlpha700: 'var(--base-color-palette-static-white-alpha700)',
    },
    stroke: {
      brand: 'var(--base-color-stroke-brand)',
      neutral: 'var(--base-color-stroke-neutral)',
      neutralMuted: 'var(--base-color-stroke-neutral-muted)',
      neutralSubtle: 'var(--base-color-stroke-neutral-subtle)',
    },
  },
} as const

const scale = {
  t1: { fontSize: '11px', lineHeight: '14px' },
  t2: { fontSize: '12px', lineHeight: '16px' },
  t3: { fontSize: '13px', lineHeight: '18px' },
  t4: { fontSize: '14px', lineHeight: '19px' },
  t5: { fontSize: '16px', lineHeight: '22px' },
  t6: { fontSize: '18px', lineHeight: '24px' },
  t7: { fontSize: '20px', lineHeight: '28px' },
  t8: { fontSize: '24px', lineHeight: '32px' },
} as const

/** Text presets spread into style declarations, mirroring the component typography tokens. */
export const typography = {
  t1Regular: { ...scale.t1, fontWeight: '400' },
  t2Bold: { ...scale.t2, fontWeight: '700' },
  t2Regular: { ...scale.t2, fontWeight: '400' },
  t3Bold: { ...scale.t3, fontWeight: '700' },
  t3Regular: { ...scale.t3, fontWeight: '400' },
  t4Bold: { ...scale.t4, fontWeight: '700' },
  t4Medium: { ...scale.t4, fontWeight: '500' },
  t4Regular: { ...scale.t4, fontWeight: '400' },
  t5Bold: { ...scale.t5, fontWeight: '700' },
  t5Medium: { ...scale.t5, fontWeight: '500' },
  t5Regular: { ...scale.t5, fontWeight: '400' },
  t6Bold: { ...scale.t6, fontWeight: '700' },
  t7Bold: { ...scale.t7, fontWeight: '700' },
  t8Bold: { ...scale.t8, fontWeight: '700' },
} as const
