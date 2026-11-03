import { style, styleVariants } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const column = { display: 'flex', flexDirection: 'column' } as const
const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const regular = {
  color: vars.color.fg.neutral,
  fontSize: '16px',
  lineHeight: '22px',
}

export const root = style({ ...column, boxSizing: 'border-box', width: '100%' })
export const info = style({ ...column, gap: '12px' })
export const infoRow = style({ ...row, gap: '8px', minHeight: '22px' })
export const topRow = style({ alignItems: 'flex-start' })
export const icon = style({
  backgroundColor: vars.color.fg.neutralSubtle,
  borderRadius: '4px',
  flexShrink: 0,
  height: '16px',
  width: '16px',
})
export const topIcon = style({ marginTop: '2px' })
export const smallIcon = style({
  height: '14px',
  marginTop: '3px',
  width: '14px',
})
export const rowContent = style({
  ...row,
  flex: 1,
  flexWrap: 'wrap',
  gap: '6px',
  minWidth: 0,
})
export const noWrap = style({ flexWrap: 'nowrap' })
export const priceAnnotations = style({
  ...row,
  flex: 1,
  gap: '2px',
  minWidth: 0,
})
export const infoText = style({
  ...regular,
  fontWeight: '500',
  whiteSpace: 'normal',
})
export const eventText = style([
  infoText,
  { color: vars.color.palette.carrot800, fontWeight: '400' },
])
export const price = style({
  ...regular,
  flexShrink: 0,
  fontWeight: '700',
  whiteSpace: 'nowrap',
})
export const annotation = style({
  color: vars.color.fg.positive,
  flexShrink: 1,
  fontSize: '14px',
  fontWeight: '700',
  lineHeight: regular.lineHeight,
  whiteSpace: 'normal',
})
export const annotationDot = style([
  annotation,
  { flexShrink: 0, fontSize: '13px', lineHeight: '18px', paddingBottom: '1px' },
])
export const muted = style({ color: vars.color.fg.neutralSubtle })
export const calendarToggle = style({ ...row, gap: '2px' })
export const small = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralSubtle,
})
export const body = style({ marginTop: '24px' })
export const tags = style({
  ...row,
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '16px',
})
export const tag = style({
  backgroundColor: vars.color.bg.neutralWeak,
  borderRadius: '4px',
  padding: '4px 8px',
})
export const tagLabel = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralMuted,
})
export const counts = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
  marginTop: '20px',
})
export const countsAfterSection = style({ marginTop: 0 })
export const card = style({
  ...column,
  border: `1px solid ${vars.color.stroke.neutralSubtle}`,
  borderRadius: '12px',
  marginBottom: '16px',
  marginTop: '20px',
  padding: '20px 16px',
})
export const cardRow = style({ ...row, gap: '20px' })
export const circle = style({
  ...row,
  borderRadius: '22px',
  flexShrink: 0,
  height: '44px',
  justifyContent: 'center',
  width: '44px',
})
export const shippingCircle = style({
  backgroundColor: vars.color.palette.purple100,
})
export const rewardCircle = style({
  backgroundColor: vars.color.bg.informativeWeak,
})
export const otherCircle = style({ backgroundColor: vars.color.bg.neutralWeak })
export const circleGlyph = style({
  backgroundColor: vars.color.fg.neutralMuted,
  borderRadius: '10px',
  height: '20px',
  width: '20px',
})
export const cardText = style({ ...column, flex: 1, gap: '4px' })
export const subtitle = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutral,
  whiteSpace: 'normal',
})
export const bold = style({ fontWeight: '700' })
export const cardTitle = style([
  subtitle,
  { color: vars.color.fg.neutralMuted },
])
export const cardDescription = style([subtitle, { fontWeight: '500' }])
export const separator = style({
  backgroundColor: vars.color.stroke.neutralMuted,
  height: '1px',
})
export const cardSeparator = style([
  separator,
  {
    marginBottom: '16px',
    marginLeft: '8px',
    marginRight: '8px',
    marginTop: '16px',
  },
])
export const notice = style({ ...column, gap: '8px', marginTop: '20px' })
export const noticeEntry = style({
  ...row,
  backgroundColor: vars.color.bg.neutralWeak,
  borderRadius: '10px',
  boxSizing: 'border-box',
  gap: '12px',
  minHeight: '50px',
  padding: '14px',
})
export const noticeText = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutral,
  flex: 1,
  whiteSpace: 'normal',
})
export const orders = style({
  ...column,
  borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
  gap: '4px',
  marginTop: '16px',
  paddingBottom: '20px',
  paddingTop: '20px',
})
export const ordersTitle = style({
  ...typography.t5Bold,
  color: vars.color.fg.neutral,
})
export const ordersDescription = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralMuted,
})
export const calendar = style({
  ...column,
  backgroundColor: vars.color.bg.layerDefault,
  // Body padding is 16px, and the calendar extends across it on both sides.
  marginLeft: '-16px',
  marginRight: '-16px',
  marginTop: '8px',
  padding: '12px 6px 6px',
})
export const week = style({ ...row })
export const day = style({
  aspectRatio: '1',
  position: 'relative',
  width: `${100 / 7}%`,
})
export const calendarCell = style({
  ...row,
  bottom: '4px',
  justifyContent: 'center',
  left: 0,
  position: 'absolute',
  right: 0,
  top: '4px',
})
export const calendarSegments = styleVariants({
  end: {
    borderBottomRightRadius: '999px',
    borderTopRightRadius: '999px',
    paddingLeft: '4px',
    right: '4px',
  },
  middle: {},
  none: { left: '4px', right: '4px' },
  single: { borderRadius: '50%', left: '4px', right: '4px' },
  start: {
    borderBottomLeftRadius: '999px',
    borderTopLeftRadius: '999px',
    left: '4px',
    paddingRight: '4px',
  },
})
export const weekStart = style({ left: '4px', right: 0 })
export const weekEnd = style({ left: 0, right: '4px' })
export const dayNumber = style({
  ...typography.t5Regular,
  color: vars.color.fg.neutral,
  whiteSpace: 'nowrap',
})
export const selectedDay = style({
  backgroundColor: vars.color.palette.gray900,
})
export const pastSelectedDay = style({
  backgroundColor: vars.color.palette.gray200,
})
export const selectedDayNumber = style({ color: vars.color.palette.gray00 })
export const pastDayNumber = style({ color: vars.color.palette.gray500 })
export const holidayNumber = style({ color: vars.color.palette.carrot600 })
export const weekdays = style({ ...row, marginBottom: '4px' })
export const weekday = style({
  ...typography.t3Regular,
  textAlign: 'center',
  width: `${100 / 7}%`,
})
export const weekdayTone = styleVariants({
  fri: { color: vars.color.palette.gray700 },
  mon: { color: vars.color.palette.gray700 },
  sat: { color: vars.color.palette.blue900 },
  sun: { color: vars.color.palette.carrot600 },
  thu: { color: vars.color.palette.gray700 },
  tue: { color: vars.color.palette.gray700 },
  wed: { color: vars.color.palette.gray700 },
})
export const pickupDays = style({ ...row, gap: '4px' })
export const pickupDay = style({
  ...row,
  borderRadius: '11px',
  height: '22px',
  justifyContent: 'center',
  width: '22px',
})
export const pickupDayOn = style({
  backgroundColor: vars.color.palette.gray900,
})
export const pickupDayLabel = style({
  ...typography.t2Regular,
  color: vars.color.fg.neutralSubtle,
})
export const pickupDayLabelOn = style({
  color: vars.color.palette.gray00,
  fontWeight: '700',
})
export const footnote = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralSubtle,
  marginTop: '10px',
  whiteSpace: 'normal',
})
export const error = style({
  ...typography.t3Regular,
  backgroundColor: vars.color.bg.criticalWeak,
  borderRadius: '8px',
  color: vars.color.fg.critical,
  padding: '10px 12px',
  whiteSpace: 'normal',
})
