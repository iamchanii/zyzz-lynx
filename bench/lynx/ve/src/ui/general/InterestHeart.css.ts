import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '../../tokens.js'

const pop = keyframes({
  '0%': { transform: 'scale(1)' },
  '40%': { transform: 'scale(1.3)' },
  '100%': { transform: 'scale(1)' },
})

export const root = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  position: 'relative',
})
export const small = style({ height: '20px', width: '20px' })
export const large = style({ height: '28px', width: '28px' })
export const heart = style({
  border: `2px solid ${vars.color.fg.neutralSubtle}`,
  borderRadius: '45% 45% 50% 50%',
  height: '70%',
  transform: 'rotate(45deg)',
  width: '70%',
})
export const filled = style({
  backgroundColor: vars.color.palette.carrot500,
  borderColor: vars.color.palette.carrot500,
})
export const popping = style({
  animationDuration: '320ms',
  animationFillMode: 'both',
  animationName: pop,
  animationTimingFunction: 'ease-out',
})
export const inverted = style({ borderColor: vars.color.fg.staticWhite })
