import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const column = { display: 'flex', flexDirection: 'column' } as const

export const root = style({ ...row, gap: '12px', padding: '20px 16px' })
export const logo = style({
  backgroundColor: vars.color.palette.gray200,
  border: `1px solid ${vars.color.stroke.neutralSubtle}`,
  borderRadius: '22px',
  flexShrink: 0,
  height: '44px',
  overflow: 'hidden',
  width: '44px',
})
export const logoImage = style({ height: '100%', width: '100%' })
export const text = style({ ...column, flex: 1, gap: '2px', minWidth: 0 })
export const nameRow = style({ ...row, gap: '4px' })
export const name = style({
  ...typography.t4Bold,
  color: vars.color.fg.neutral,
  flexShrink: 1,
  minWidth: 0,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const storeMark = style({
  backgroundColor: vars.color.bg.brandSolid,
  borderRadius: '2px',
  flexShrink: 0,
  height: '12px',
  width: '12px',
})
export const followers = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralSubtle,
})
export const description = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralMuted,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const follow = style({
  ...row,
  backgroundColor: vars.color.bg.brandSolid,
  borderRadius: '6px',
  flexShrink: 0,
  height: '32px',
  justifyContent: 'center',
  padding: '0 12px',
})
export const following = style({
  backgroundColor: vars.color.bg.layerDefault,
  border: `1px solid ${vars.color.stroke.brand}`,
})
export const followLabel = style({
  ...typography.t3Bold,
  color: vars.color.fg.staticWhite,
})
export const followingLabel = style({ color: vars.color.fg.brand })
