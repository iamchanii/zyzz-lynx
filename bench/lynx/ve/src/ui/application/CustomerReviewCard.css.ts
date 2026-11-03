import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const column = { display: 'flex', flexDirection: 'column' } as const

export const card = style({ ...column, padding: '20px 0' })
export const profile = style({ ...row, marginBottom: '10px' })
export const avatar = style({
  borderRadius: '50%',
  flexShrink: 0,
  height: '24px',
  width: '24px',
})
export const avatarFallback = style([
  avatar,
  { backgroundColor: vars.color.palette.gray500 },
])
export const identity = style({
  ...row,
  flex: 1,
  flexWrap: 'wrap',
  gap: '4px',
  marginLeft: '8px',
  minWidth: 0,
})
export const nickname = style({
  ...typography.t4Bold,
  color: vars.color.fg.neutral,
})
export const time = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const menuTrigger = style({ ...row, flexShrink: 0, marginLeft: '10px' })
export const menuDot = style({
  backgroundColor: vars.color.fg.neutralSubtle,
  borderRadius: '2px',
  height: '4px',
  marginLeft: '2px',
  width: '4px',
})
export const bodyRow = style({ ...row, alignItems: 'flex-start', gap: '7px' })
export const body = style({ ...column, flex: 1, minWidth: 0 })
export const bodyText = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutral,
  lineHeight: '21px',
  whiteSpace: 'normal',
})
export const information = style({ ...column, gap: '2px', marginTop: '6px' })
export const infoLine = style({
  ...typography.t3Regular,
  color: vars.color.palette.gray700,
})
export const infoLabel = style({ fontWeight: '700' })
export const thumbnail = style({
  borderRadius: '6px',
  flexShrink: 0,
  height: '48px',
  overflow: 'hidden',
  position: 'relative',
  width: '48px',
})
export const thumbnailImage = style({ height: '100%', width: '100%' })
export const thumbnailBorder = style({
  border: `1px solid ${vars.color.stroke.neutralSubtle}`,
  borderRadius: '6px',
  bottom: 0,
  left: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
})
export const tags = style({
  ...row,
  flexWrap: 'wrap',
  gap: '4px',
  marginTop: '10px',
})
export const tag = style({
  backgroundColor: vars.color.bg.neutralWeak,
  borderRadius: '4px',
  padding: '3px 6px',
})
export const tagLabel = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralMuted,
})
export const reaction = style({
  ...row,
  gap: '4px',
  marginTop: '12px',
  minHeight: '28px',
})
export const reactionLabel = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const reactionActive = style({
  color: vars.color.fg.brand,
  fontWeight: '700',
})
