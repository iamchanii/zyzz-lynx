import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '../../tokens.js'

export const dismiss = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } })
export const root = style({ position: 'relative', width: '100%' })
export const fill = style({ height: '100%', width: '100%' })
export const clipped = style({ overflow: 'hidden' })
export const outgoing = style({
  backgroundColor: vars.color.bg.layerDefault,
  height: '100%',
  left: 0,
  opacity: 1,
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: 20,
})
export const dismissing = style({
  animationDuration: '180ms',
  animationFillMode: 'both',
  animationName: dismiss,
  animationTimingFunction: 'ease-out',
})
export const transparent = style({ backgroundColor: 'transparent' })
