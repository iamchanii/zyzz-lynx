import { globalStyle, style } from '@vanilla-extract/css'
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
  paddingBottom: '20px',
  paddingTop: '32px',
  position: 'relative',
  width: '100%',
})
export const heading = style({
  ...typography.t6Bold,
  color: vars.color.fg.neutral,
  marginLeft: '16px',
  marginRight: '16px',
})
export const card = style({ ...column, padding: '16px' })
export const firstCard = style({ paddingTop: '24px' })
export const divider = style({
  backgroundColor: vars.color.palette.gray200,
  height: '1px',
  marginLeft: '16px',
  marginRight: '16px',
})
export const decoration = style({ ...row, height: '16px', marginBottom: '4px' })
export const logo = style({ flexShrink: 0, height: '16px', width: '48px' })
export const titleRow = style({ ...row, gap: '6px' })
export const title = style({
  ...typography.t5Bold,
  color: vars.color.fg.neutral,
  flexGrow: 1,
  flexShrink: 1,
  minWidth: 0,
  textOverflow: 'ellipsis',
})
export const interest = style({
  ...row,
  flexShrink: 0,
  height: '20px',
  justifyContent: 'center',
  position: 'relative',
  width: '20px',
})
export const content = style({
  ...row,
  alignItems: 'flex-start',
  gap: '12px',
  marginTop: '8px',
})
export const information = style({
  ...column,
  flexGrow: 1,
  flexShrink: 1,
  gap: '4px',
  minWidth: 0,
})
export const informationRow = style({
  ...row,
  alignItems: 'flex-start',
  gap: '4px',
})
export const informationIcon = style({
  ...row,
  flexShrink: 0,
  height: '19px',
})
export const informationGlyph = style({
  backgroundColor: vars.color.fg.neutralSubtle,
  borderRadius: '3px',
  height: '12px',
  width: '12px',
})
export const workConditions = style({ flexShrink: 1, minWidth: 0 })
export const workConditionItem = style({ maxWidth: '100%' })
export const informationText = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralMuted,
  flexShrink: 1,
  minWidth: 0,
})
export const pay = style({ ...typography.t4Bold, color: vars.color.fg.neutral })
export const meta = style({ ...row, minWidth: 0 })
export const metaText = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralSubtle,
  flexShrink: 0,
})
export const authorLabel = style({
  flexShrink: 1,
  minWidth: 0,
  textOverflow: 'ellipsis',
})
export const advertisement = style({ ...row, flexShrink: 0, gap: '2px' })
export const photo = style({
  borderRadius: '6px',
  flexShrink: 0,
  height: '88px',
  overflow: 'hidden',
  position: 'relative',
  width: '88px',
  '@media': {
    '(max-width: 360px)': { height: '72px', width: '72px' },
  },
})
export const photoImage = style({ height: '100%', width: '100%' })
export const photoBorder = style({
  border: `1px solid ${vars.color.stroke.neutralSubtle}`,
  borderRadius: '6px',
  bottom: 0,
  left: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
})
export const badges = style({
  ...row,
  flexWrap: 'wrap',
  gap: '4px',
  marginTop: '4px',
})
// Native glyph advances are narrower than the web view's at this 11px size.
globalStyle(`${badges} text`, { letterSpacing: '0.2px' })
export const more = style({
  ...row,
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: '6px',
  height: '40px',
  justifyContent: 'center',
  marginLeft: '16px',
  marginRight: '16px',
  ':active': { backgroundColor: vars.color.bg.neutralWeak },
})
export const moreLabel = style({
  ...typography.t4Medium,
  color: vars.color.fg.neutral,
})
export const emptyMore = style({ marginTop: '24px' })
export const hidden = style({
  ...row,
  backgroundColor: vars.color.bg.neutralMuted,
  borderRadius: '8px',
  gap: '6px',
  padding: '14px 16px',
})
export const hiddenText = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralMuted,
})
export const policyLink = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralSubtle,
  textDecoration: 'underline',
})
