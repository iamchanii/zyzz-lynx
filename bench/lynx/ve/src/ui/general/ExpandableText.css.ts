import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

export const root = style({ display: 'flex', flexDirection: 'column' })
export const body = style({
  ...typography.t5Regular,
  color: vars.color.fg.neutral,
  lineHeight: '24px',
  whiteSpace: 'pre-wrap',
})
export const toggle = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  marginTop: '8px',
  minHeight: '28px',
})
export const toggleLabel = style({
  ...typography.t4Medium,
  color: vars.color.fg.neutralMuted,
  textDecoration: 'underline',
})
