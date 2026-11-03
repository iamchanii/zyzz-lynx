import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

export const root = style({
  backgroundColor: vars.color.bg.positiveWeak,
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '16px',
  padding: '14px 16px',
})
export const entry = style({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
})
export const check = style({
  backgroundColor: vars.color.fg.positive,
  borderRadius: '8px',
  flexShrink: 0,
  height: '16px',
  marginTop: '1px',
  width: '16px',
})
export const label = style({
  ...typography.t4Bold,
  color: vars.color.fg.positive,
})
export const description = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralMuted,
  flex: 1,
  whiteSpace: 'normal',
})
