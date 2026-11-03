import { style } from '@vanilla-extract/css'
import { vars } from '../../tokens.js'

export const root = style({
  backgroundColor: vars.color.palette.gray200,
  borderRadius: '6px',
  flexShrink: 0,
})
export const line = style({ height: '16px' })
export const block = style({ height: '22px' })
