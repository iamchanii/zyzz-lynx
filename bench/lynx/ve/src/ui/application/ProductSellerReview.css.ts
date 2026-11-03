import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const column = { display: 'flex', flexDirection: 'column' } as const

export const root = style({ ...column, width: '100%' })
export const header = style({
  ...row,
  justifyContent: 'space-between',
  padding: '0 16px',
})
export const heading = style({
  ...typography.t6Bold,
  color: vars.color.fg.neutral,
})
export const count = style({
  ...typography.t6Bold,
  color: vars.color.fg.neutralSubtle,
  marginLeft: '4px',
})
export const more = style({ ...row, gap: '2px', minHeight: '32px' })
export const moreLabel = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralSubtle,
})
export const summary = style({
  ...row,
  backgroundColor: vars.color.bg.neutralWeak,
  borderRadius: '10px',
  gap: '12px',
  margin: '16px 16px 0',
  padding: '14px 16px',
})
export const summaryScore = style({
  ...typography.t7Bold,
  color: vars.color.fg.neutral,
})
export const summaryText = style({ ...column, flex: 1, gap: '2px' })
export const summaryTitle = style({
  ...typography.t4Bold,
  color: vars.color.fg.neutral,
})
export const summaryDescription = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralMuted,
})
export const chips = style({
  ...row,
  flexWrap: 'wrap',
  gap: '6px',
  padding: '16px 16px 4px',
})
export const chip = style({
  ...row,
  backgroundColor: vars.color.bg.layerDefault,
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: '1000px',
  gap: '4px',
  height: '30px',
  padding: '0 10px',
})
export const chipLabel = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutral,
})
export const chipCount = style({
  ...typography.t3Bold,
  color: vars.color.fg.neutralMuted,
})
export const list = style({ ...column, padding: '0 16px' })
export const separator = style({
  backgroundColor: vars.color.stroke.neutralSubtle,
  height: '1px',
})
export const empty = style({
  ...column,
  alignItems: 'center',
  gap: '8px',
  padding: '32px 16px',
})
export const emptyText = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralSubtle,
})
