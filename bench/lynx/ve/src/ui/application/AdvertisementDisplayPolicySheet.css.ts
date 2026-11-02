import { style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const column = { display: 'flex', flexDirection: 'column' } as const
const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

export const backdrop = style({
  backgroundColor: vars.color.bg.overlay,
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: 40,
})
export const sheet = style({
  ...column,
  backgroundColor: vars.color.bg.layerFloating,
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  bottom: 0,
  left: 0,
  overflow: 'hidden',
  position: 'absolute',
  right: 0,
  zIndex: 41,
})
export const handle = style({
  alignSelf: 'center',
  backgroundColor: vars.color.palette.gray300,
  borderRadius: '2px',
  height: '4px',
  marginTop: '8px',
  width: '40px',
})
export const imageArea = style({
  ...row,
  backgroundColor: vars.color.stroke.neutralSubtle,
  justifyContent: 'center',
  marginTop: '16px',
  paddingBottom: '24px',
  paddingTop: '24px',
})
export const image = style({
  backgroundColor: vars.color.palette.gray00,
  borderRadius: '8px',
  height: '146px',
  width: '227px',
})
export const copy = style({ ...column, gap: '6px', padding: '24px 16px 16px' })
export const title = style({
  ...typography.t7Bold,
  color: vars.color.palette.gray1000,
})
export const body = style({
  ...typography.t5Regular,
  color: vars.color.palette.gray800,
  whiteSpace: 'normal',
})
export const footer = style({ padding: '12px 16px 8px' })
export const confirm = style({
  ...row,
  backgroundColor: vars.color.bg.brandSolid,
  borderRadius: '6px',
  height: '52px',
  justifyContent: 'center',
  ':active': { backgroundColor: vars.color.palette.carrot600 },
})
export const confirmLabel = style({
  ...typography.t5Bold,
  color: vars.color.fg.staticWhite,
})
export const safeArea = style({ height: '16rpx' })
