import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const column = { display: 'flex', flexDirection: 'column' } as const

export const root = style({ ...column, padding: '20px 16px', width: '100%' })
export const header = style({ ...row, justifyContent: 'space-between' })
export const heading = style({
  ...typography.t6Bold,
  color: vars.color.fg.neutral,
})
export const refresh = style({ ...row, gap: '4px', minHeight: '32px' })
export const refreshIcon = style({
  border: `2px solid ${vars.color.fg.neutralSubtle}`,
  borderRadius: '7px',
  borderTopColor: vars.color.bg.transparent,
  height: '14px',
  width: '14px',
})
export const refreshLabel = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const card = style({
  ...row,
  alignItems: 'flex-start',
  gap: '16px',
  paddingTop: '16px',
})
export const cardText = style({
  ...column,
  flexGrow: 1,
  gap: '6px',
  minWidth: 0,
})
export const title = style({
  ...typography.t5Medium,
  color: vars.color.fg.neutral,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const store = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const delivery = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralMuted,
})
export const price = style({
  ...typography.t4Bold,
  color: vars.color.fg.neutral,
})
export const badges = style({
  ...row,
  flexWrap: 'wrap',
  gap: '4px',
  marginTop: '2px',
})
export const thumbnail = style({
  backgroundColor: vars.color.palette.gray200,
  borderRadius: '8px',
  flexShrink: 0,
  height: '72px',
  overflow: 'hidden',
  width: '72px',
})
export const thumbnailImage = style({ height: '100%', width: '100%' })
export const footer = style({
  ...row,
  justifyContent: 'center',
  marginTop: '20px',
})
export const footerButton = style({
  ...row,
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: '6px',
  height: '40px',
  justifyContent: 'center',
  width: '100%',
})
export const footerLabel = style({
  ...typography.t4Medium,
  color: vars.color.fg.neutral,
})
