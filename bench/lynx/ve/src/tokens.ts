/**
 * Typed references to the design-token custom properties declared in `tokens.css`, plus the
 * typography presets that style modules spread into text declarations.
 * @module
 */

export const vars = {
  color: {
    bg: {
      brandSolid: 'var(--seed-color-bg-brand-solid)',
      brandWeak: 'var(--seed-color-bg-brand-weak)',
      criticalWeak: 'var(--seed-color-bg-critical-weak)',
      disabled: 'var(--seed-color-bg-disabled)',
      informativeSolid: 'var(--seed-color-bg-informative-solid)',
      informativeWeak: 'var(--seed-color-bg-informative-weak)',
      layerBasement: 'var(--seed-color-bg-layer-basement)',
      layerDefault: 'var(--seed-color-bg-layer-default)',
      layerFloating: 'var(--seed-color-bg-layer-floating)',
      neutralInverted: 'var(--seed-color-bg-neutral-inverted)',
      neutralMuted: 'var(--seed-color-bg-neutral-muted)',
      neutralWeak: 'var(--seed-color-bg-neutral-weak)',
      overlay: 'var(--seed-color-bg-overlay)',
      positiveWeak: 'var(--seed-color-bg-positive-weak)',
      transparent: 'var(--seed-color-bg-transparent)',
    },
    fg: {
      brand: 'var(--seed-color-fg-brand)',
      critical: 'var(--seed-color-fg-critical)',
      disabled: 'var(--seed-color-fg-disabled)',
      informative: 'var(--seed-color-fg-informative)',
      neutral: 'var(--seed-color-fg-neutral)',
      neutralInverted: 'var(--seed-color-fg-neutral-inverted)',
      neutralMuted: 'var(--seed-color-fg-neutral-muted)',
      neutralSubtle: 'var(--seed-color-fg-neutral-subtle)',
      placeholder: 'var(--seed-color-fg-placeholder)',
      positive: 'var(--seed-color-fg-positive)',
      staticWhite: 'var(--seed-color-fg-static-white)',
    },
    palette: {
      blue900: 'var(--seed-color-palette-blue900)',
      carrot500: 'var(--seed-color-palette-carrot500)',
      carrot600: 'var(--seed-color-palette-carrot600)',
      carrot800: 'var(--seed-color-palette-carrot800)',
      gray00: 'var(--seed-color-palette-gray00)',
      gray100: 'var(--seed-color-palette-gray100)',
      gray1000: 'var(--seed-color-palette-gray1000)',
      gray200: 'var(--seed-color-palette-gray200)',
      gray300: 'var(--seed-color-palette-gray300)',
      gray500: 'var(--seed-color-palette-gray500)',
      gray700: 'var(--seed-color-palette-gray700)',
      gray800: 'var(--seed-color-palette-gray800)',
      gray900: 'var(--seed-color-palette-gray900)',
      green500: 'var(--seed-color-palette-green500)',
      purple100: 'var(--seed-color-palette-purple100)',
      staticBlackAlpha500: 'var(--seed-color-palette-static-black-alpha500)',
      staticWhiteAlpha700: 'var(--seed-color-palette-static-white-alpha700)',
    },
    stroke: {
      brand: 'var(--seed-color-stroke-brand)',
      neutral: 'var(--seed-color-stroke-neutral)',
      neutralMuted: 'var(--seed-color-stroke-neutral-muted)',
      neutralSubtle: 'var(--seed-color-stroke-neutral-subtle)',
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
