import { keyframes, style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const enter = keyframes({
  from: { opacity: 0, transform: 'scale(0)' },
  to: { opacity: 1, transform: 'scale(1)' },
})
const exit = keyframes({
  from: { opacity: 1, transform: 'translateY(0)' },
  to: { opacity: 0, transform: 'translateY(100%)' },
})
const fade = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
const contents = keyframes({
  from: { opacity: 0, transform: 'translateY(30%)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})
const countdown = keyframes({
  from: { transform: 'scaleX(1)' },
  to: { transform: 'scaleX(0)' },
})

export const positioner = style({
  left: '16px',
  paddingTop: '8px',
  position: 'absolute',
  right: '16px',
  transformOrigin: 'bottom center',
  zIndex: 20,
})
export const opening = style({
  animationDuration: '300ms',
  animationFillMode: 'both',
  animationName: enter,
  animationTimingFunction: 'ease-out',
})
export const closing = style({
  animationDuration: '300ms',
  animationFillMode: 'both',
  animationName: exit,
  animationTimingFunction: 'ease-out',
})
export const surface = style({
  backgroundColor: vars.color.bg.layerFloating,
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.16)',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
})
export const body = style({
  alignItems: 'center',
  animationDelay: '300ms',
  animationDuration: '300ms',
  animationFillMode: 'both',
  animationName: contents,
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  padding: '16px',
})
export const bell = style({
  backgroundColor: vars.color.bg.brandWeak,
  borderRadius: '16px',
  flexShrink: 0,
  height: '32px',
  width: '32px',
})
export const text = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  paddingRight: '12px',
})
export const title = style({
  ...typography.t4Bold,
  color: vars.color.fg.neutral,
})
export const description = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralSubtle,
})
export const close = style({
  alignItems: 'center',
  animationDelay: '300ms',
  animationDuration: '300ms',
  animationFillMode: 'both',
  animationName: fade,
  backgroundColor: vars.color.bg.neutralWeak,
  borderRadius: '50%',
  display: 'flex',
  height: '28px',
  justifyContent: 'center',
  position: 'absolute',
  right: '12px',
  top: '8px',
  width: '28px',
})
export const closeGlyph = style({
  backgroundColor: vars.color.fg.neutralMuted,
  borderRadius: '1px',
  height: '2px',
  transform: 'rotate(45deg)',
  width: '12px',
})
export const progressTrack = style({
  animationDelay: '300ms',
  animationDuration: '300ms',
  animationFillMode: 'both',
  animationName: fade,
  height: '2px',
})
export const progress = style({
  animationDelay: '600ms',
  animationDuration: '6400ms',
  animationFillMode: 'both',
  animationName: countdown,
  animationTimingFunction: 'linear',
  backgroundColor: vars.color.fg.neutral,
  height: '2px',
  transformOrigin: 'left center',
})
