import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const column = { display: 'flex', flexDirection: 'column' } as const

export const root = style({ ...column, width: '100%' })
export const heading = style({
  ...typography.t6Bold,
  color: vars.color.fg.neutral,
})
export const profile = style({ ...row, gap: '12px', marginTop: '16px' })
export const avatar = style({
  backgroundColor: vars.color.palette.gray200,
  borderRadius: '24px',
  flexShrink: 0,
  height: '48px',
  width: '48px',
})
export const avatarImage = style({
  borderRadius: '24px',
  height: '100%',
  width: '100%',
})
export const identity = style({ ...column, flex: 1, gap: '2px', minWidth: 0 })
export const nicknameRow = style({ ...row, gap: '4px' })
export const nickname = style({
  ...typography.t5Bold,
  color: vars.color.fg.neutral,
  flexShrink: 1,
  minWidth: 0,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const verified = style({
  backgroundColor: vars.color.bg.informativeSolid,
  borderRadius: '7px',
  flexShrink: 0,
  height: '14px',
  width: '14px',
})
export const summary = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const satisfaction = style({
  ...column,
  alignItems: 'flex-end',
  flexShrink: 0,
  gap: '4px',
})
export const satisfactionValue = style({
  ...typography.t5Bold,
  color: vars.color.palette.green500,
})
export const satisfactionTrack = style({
  backgroundColor: vars.color.bg.neutralMuted,
  borderRadius: '2px',
  height: '4px',
  overflow: 'hidden',
  width: '56px',
})
export const satisfactionRange = style({
  backgroundColor: vars.color.palette.green500,
  borderRadius: '2px',
  height: '100%',
  width: '42%',
})
export const stats = style({
  ...row,
  backgroundColor: vars.color.bg.neutralWeak,
  borderRadius: '10px',
  marginTop: '16px',
  padding: '14px 0',
})
export const stat = style({
  ...column,
  alignItems: 'center',
  flex: 1,
  gap: '2px',
})
export const statSeparator = style({
  backgroundColor: vars.color.stroke.neutralMuted,
  height: '24px',
  width: '1px',
})
export const statValue = style({
  ...typography.t5Bold,
  color: vars.color.fg.neutral,
})
export const statLabel = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralSubtle,
})
export const badges = style({
  ...row,
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
})
export const badge = style({
  ...row,
  border: `1px solid ${vars.color.stroke.neutralSubtle}`,
  borderRadius: '4px',
  gap: '4px',
  padding: '3px 6px',
})
export const badgeIcon = style({
  backgroundColor: vars.color.fg.positive,
  borderRadius: '6px',
  height: '12px',
  width: '12px',
})
export const badgeLabel = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralMuted,
})
export const actions = style({ ...row, gap: '8px', marginTop: '16px' })
export const action = style({
  ...row,
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: '6px',
  flex: 1,
  height: '40px',
  justifyContent: 'center',
  ':active': { backgroundColor: vars.color.bg.neutralWeak },
})
export const actionLabel = style({
  ...typography.t4Medium,
  color: vars.color.fg.neutral,
})
export const otherProducts = style({ ...column, marginTop: '20px' })
export const otherProductsTitle = style({
  ...typography.t4Bold,
  color: vars.color.fg.neutral,
})
export const otherProduct = style({
  ...row,
  gap: '12px',
  paddingBottom: '12px',
  paddingTop: '12px',
})
export const otherProductThumbnail = style({
  backgroundColor: vars.color.palette.gray200,
  borderRadius: '6px',
  flexShrink: 0,
  height: '48px',
  width: '48px',
})
export const otherProductText = style({
  ...column,
  flex: 1,
  gap: '2px',
  minWidth: 0,
})
export const otherProductTitle = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutral,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const otherProductMeta = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const separator = style({
  backgroundColor: vars.color.stroke.neutralSubtle,
  height: '1px',
})
