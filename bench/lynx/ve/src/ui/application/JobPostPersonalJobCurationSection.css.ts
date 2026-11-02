import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const column = { display: 'flex', flexDirection: 'column' } as const

export const root = style({ ...column, paddingTop: '16px', width: '100%' })
export const heading = style({
  ...typography.t6Bold,
  color: vars.color.fg.neutral,
  padding: '8px 16px',
})
export const tabs = style({
  ...row,
  gap: '6px',
  height: '56px',
  padding: '8px 16px 12px',
})
export const rows = style({ ...column, padding: '12px 16px' })
export const post = style({ ...column, gap: '4px', padding: '12px 0' })
export const postTitle = style({
  ...typography.t5Medium,
  color: vars.color.fg.neutral,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const postMetaRow = style({ ...row, gap: '6px' })
export const postPay = style({
  ...typography.t4Bold,
  color: vars.color.fg.neutral,
})
export const postMeta = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const separator = style({
  backgroundColor: vars.color.stroke.neutralSubtle,
  height: '1px',
})
export const more = style({ padding: '8px 16px 24px' })
export const moreButton = style({
  ...row,
  backgroundColor: vars.color.bg.neutralWeak,
  borderRadius: '6px',
  height: '40px',
  justifyContent: 'center',
})
export const moreLabel = style({
  ...typography.t4Medium,
  color: vars.color.fg.neutral,
})
