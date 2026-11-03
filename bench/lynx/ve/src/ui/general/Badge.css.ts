import { style, styleVariants } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

export const root = style({
  alignItems: 'center',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'row',
  flexShrink: 0,
  height: '20px',
  padding: '0 6px',
})
export const label = style({
  ...typography.t1Regular,
  fontWeight: '700',
  whiteSpace: 'nowrap',
})
export const tone = styleVariants({
  brand: { backgroundColor: vars.color.bg.brandWeak },
  informative: { backgroundColor: vars.color.bg.informativeWeak },
  neutral: { backgroundColor: vars.color.bg.neutralWeak },
  positive: { backgroundColor: vars.color.bg.positiveWeak },
})
export const labelTone = styleVariants({
  brand: { color: vars.color.fg.brand },
  informative: { color: vars.color.fg.informative },
  neutral: { color: vars.color.fg.neutralMuted },
  positive: { color: vars.color.fg.positive },
})
export const outlined = style({
  backgroundColor: vars.color.bg.layerDefault,
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
})
