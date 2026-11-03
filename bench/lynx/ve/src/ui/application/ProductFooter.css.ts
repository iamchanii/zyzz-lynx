import { style, styleVariants } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

export const root = style({
  backgroundColor: vars.color.bg.layerDefault,
  borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
  flexShrink: 0,
  width: '100%',
})
export const actions = style({ ...row, gap: '8px', padding: '12px 16px' })
export const interest = style({
  ...row,
  flexShrink: 0,
  height: '44px',
  justifyContent: 'center',
  marginRight: '8px',
  width: '32px',
})
export const button = style({
  ...row,
  borderRadius: '6px',
  flexBasis: 0,
  flexGrow: 1,
  flexShrink: 1,
  justifyContent: 'center',
  minWidth: 0,
})
export const size = styleVariants({
  large: { minHeight: '52px', padding: '0 20px' },
  medium: { minHeight: '44px', padding: '0 16px' },
})
export const tone = styleVariants({
  brand: {
    backgroundColor: vars.color.bg.brandSolid,
    ':active': { backgroundColor: vars.color.palette.carrot600 },
  },
  neutral: {
    backgroundColor: vars.color.bg.neutralWeak,
    ':active': { backgroundColor: vars.color.bg.neutralMuted },
  },
  outline: {
    backgroundColor: vars.color.bg.layerDefault,
    border: `1px solid ${vars.color.stroke.neutral}`,
  },
})
export const label = style({ ...typography.t5Bold, whiteSpace: 'nowrap' })
export const labelTone = styleVariants({
  brand: { color: vars.color.fg.staticWhite },
  neutral: { color: vars.color.fg.neutral },
  outline: { color: vars.color.fg.neutral },
})
export const disabled = style({ backgroundColor: vars.color.bg.disabled })
export const disabledLabel = style({ color: vars.color.fg.disabled })
export const help = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
  padding: '12px 16px 0',
  textAlign: 'center',
})
export const safeArea = style({ height: '12rpx' })
