import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

export const root = style({
  ...row,
  backgroundColor: vars.color.bg.layerDefault,
  borderRadius: '1000px',
  boxShadow: `inset 0 0 0 1px ${vars.color.stroke.neutral}`,
  flexShrink: 0,
  height: '36px',
  justifyContent: 'center',
  minWidth: '48px',
  padding: '0 14px',
  '@media': {
    '(max-width: 360px)': {
      height: '32px',
      padding: '0 10px',
    },
  },
})
export const label = style({
  ...typography.t4Medium,
  color: vars.color.fg.neutral,
  padding: '0 2px',
  whiteSpace: 'nowrap',
})
export const selected = style({
  backgroundColor: vars.color.palette.gray900,
  boxShadow: 'none',
})
export const selectedLabel = style({ color: vars.color.palette.gray00 })
export const pressed = style({ backgroundColor: vars.color.bg.neutralWeak })
export const selectedPressed = style({
  backgroundColor: vars.color.palette.gray800,
})
