import { style } from '@vanilla-extract/css'
import { vars } from '../../tokens.js'

export const thin = style({
  backgroundColor: vars.color.stroke.neutralSubtle,
  flexShrink: 0,
  height: '1px',
  width: '100%',
})
export const thick = style({
  backgroundColor: vars.color.bg.layerBasement,
  flexShrink: 0,
  height: '8px',
  width: '100%',
})
export const inset = style({
  marginLeft: '16px',
  marginRight: '16px',
  width: 'auto',
})
