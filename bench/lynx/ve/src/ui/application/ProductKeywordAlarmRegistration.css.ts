import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

export const root = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
})
export const copy = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
})
export const title = style({
  ...typography.t5Bold,
  color: vars.color.fg.neutral,
})
export const description = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const highlight = style({
  color: vars.color.fg.brand,
  fontWeight: '700',
})
export const control = style({ flexShrink: 0 })
export const registered = style({
  ...typography.t3Regular,
  color: vars.color.fg.positive,
  marginTop: '8px',
})
