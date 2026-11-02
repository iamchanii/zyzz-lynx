import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

export const root = style({
  alignItems: 'center',
  backgroundColor: vars.color.bg.neutralWeak,
  borderRadius: '6px',
  display: 'flex',
  flexDirection: 'row',
  flexShrink: 0,
  justifyContent: 'center',
  minHeight: '32px',
  padding: '6px 10px',
  position: 'relative',
  ':active': { backgroundColor: vars.color.bg.neutralMuted },
})
export const touching = style({ backgroundColor: vars.color.bg.neutralMuted })
export const disabled = style({ backgroundColor: vars.color.bg.disabled })
export const content = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  gap: '4px',
})
export const icon = style({
  borderRadius: '8px',
  height: '16px',
  width: '16px',
})
export const iconOn = style({ backgroundColor: vars.color.fg.neutral })
export const iconOff = style({ border: `2px solid ${vars.color.fg.neutral}` })
export const label = style({
  ...typography.t3Bold,
  color: vars.color.fg.neutral,
  whiteSpace: 'nowrap',
})
export const disabledLabel = style({ color: vars.color.fg.disabled })
export const hidden = style({ opacity: 0 })
export const loadingIndicator = style({
  alignItems: 'center',
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
})
export const spinner = style({
  border: `2px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: '7px',
  borderTopColor: vars.color.fg.neutral,
  height: '14px',
  width: '14px',
})
