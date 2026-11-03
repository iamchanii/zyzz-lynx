import { keyframes, style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const enter = keyframes({
  from: { opacity: 0, transform: 'scale(0.9)' },
  to: { opacity: 1, transform: 'scale(1)' },
})
const exit = keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.9)' },
})

export const region = style({
  alignItems: 'center',
  display: 'flex',
  left: 0,
  padding: '8px 16px',
  position: 'absolute',
  right: 0,
  zIndex: 30,
})
export const surface = style({
  alignItems: 'center',
  backgroundColor: vars.color.bg.neutralInverted,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  justifyContent: 'space-between',
  maxWidth: '560px',
  minHeight: '48px',
  padding: '12px 16px',
  width: '100%',
})
export const opening = style({
  animationDuration: '200ms',
  animationFillMode: 'both',
  animationName: enter,
  animationTimingFunction: 'ease-out',
})
export const closing = style({
  animationDuration: '160ms',
  animationFillMode: 'both',
  animationName: exit,
  animationTimingFunction: 'ease-in',
})
export const message = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralInverted,
  flex: 1,
  minWidth: 0,
})
export const action = style({
  alignItems: 'center',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  margin: '-12px -8px',
  minHeight: '44px',
  padding: '0 8px',
})
export const actionLabel = style({
  ...typography.t4Bold,
  color: vars.color.palette.carrot500,
})
