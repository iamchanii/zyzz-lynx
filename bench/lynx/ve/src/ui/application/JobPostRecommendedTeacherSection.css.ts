import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const column = { display: 'flex', flexDirection: 'column' } as const

export const root = style({
  ...column,
  backgroundColor: vars.color.bg.layerDefault,
  paddingTop: '28px',
  width: '100%',
})
export const heading = style({
  ...typography.t6Bold,
  color: vars.color.fg.neutral,
  margin: '0 16px',
})
export const subheading = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralSubtle,
  margin: '4px 16px 0',
})
export const scroll = style({ marginTop: '16px', width: '100%' })
export const track = style({
  ...row,
  alignItems: 'stretch',
  gap: '12px',
  padding: '0 16px',
})
export const card = style({
  ...column,
  border: `1px solid ${vars.color.stroke.neutralSubtle}`,
  borderRadius: '12px',
  flexShrink: 0,
  overflow: 'hidden',
  width: '200rpx',
  ':active': { backgroundColor: vars.color.bg.neutralWeak },
})
export const photo = style({
  backgroundColor: vars.color.bg.neutralMuted,
  height: '112px',
  position: 'relative',
  width: '100%',
})
export const image = style({ height: '100%', width: '100%' })
export const rating = style({
  ...row,
  backgroundColor: vars.color.palette.staticBlackAlpha500,
  borderRadius: '10px',
  bottom: '8px',
  gap: '2px',
  left: '8px',
  padding: '2px 6px',
  position: 'absolute',
})
export const ratingStar = style({
  backgroundColor: vars.color.palette.carrot500,
  borderRadius: '5px',
  height: '10px',
  width: '10px',
})
export const ratingText = style({
  ...typography.t2Bold,
  color: vars.color.fg.staticWhite,
})
export const body = style({ ...column, gap: '4px', padding: '12px' })
export const name = style({
  ...typography.t4Bold,
  color: vars.color.fg.neutral,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const subject = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralMuted,
})
export const lessons = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralSubtle,
})
export const tags = style({
  ...row,
  flexWrap: 'wrap',
  gap: '4px',
  marginTop: '4px',
})
export const tag = style({
  backgroundColor: vars.color.bg.brandWeak,
  borderRadius: '4px',
  padding: '2px 6px',
})
export const tagLabel = style({
  ...typography.t1Regular,
  color: vars.color.fg.brand,
  fontWeight: '700',
})
export const watch = style({
  ...row,
  justifyContent: 'space-between',
  padding: '0 12px 12px',
})
export const watchLabel = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
})
export const more = style({ padding: '8px 16px 28px' })
export const moreButton = style({
  ...row,
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: '6px',
  height: '40px',
  justifyContent: 'center',
})
export const moreLabel = style({
  ...typography.t4Medium,
  color: vars.color.fg.neutral,
})
