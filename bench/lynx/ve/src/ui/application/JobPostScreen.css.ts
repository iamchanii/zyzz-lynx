import { style } from '@vanilla-extract/css'
import { vars } from '../../tokens.js'

const column = { display: 'flex', flexDirection: 'column' } as const

export const root = style({
  ...column,
  backgroundColor: vars.color.bg.layerDefault,
  width: '100%',
})
export const main = style({ padding: '24px 16px 0' })
export const lowerMain = style({ padding: '0 16px 20px' })
export const details = style({
  borderTop: `1px solid ${vars.color.stroke.neutralSubtle}`,
  marginTop: '20px',
  paddingTop: '24px',
})
export const alarm = style({
  borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
  marginTop: '20px',
  paddingTop: '24px',
})
export const linkedDivider = style({
  backgroundColor: vars.color.stroke.neutralMuted,
  height: '1px',
  margin: '0 16px',
})
export const divider = style({
  backgroundColor: vars.color.bg.layerBasement,
  flexShrink: 0,
  height: '8px',
})
export const deepScrollDivider = style([divider, { position: 'relative' }])
export const author = style({ padding: '28px 0' })
export const authorInfo = style({ padding: '0 16px' })
export const reviews = style({ marginTop: '24px' })
export const map = style({ padding: '0 16px 28px' })
export const bottomSpace = style({ height: '24px' })
