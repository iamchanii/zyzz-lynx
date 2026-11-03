import { globalStyle, style } from '@vanilla-extract/css'
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
  marginBottom: '16px',
})
export const mapRegion = style({ marginBottom: '16px' })
export const map = style({
  backgroundColor: vars.color.bg.layerDefault,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
})
export const mapFrame = style({
  borderRadius: '10px',
  height: '160px',
  overflow: 'hidden',
  position: 'relative',
})
export const border = style({
  border: `1px solid ${vars.color.stroke.neutralSubtle}`,
  borderRadius: '10px',
  bottom: 0,
  left: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
})
export const background = style({
  height: '100%',
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
})
const fade = {
  pointerEvents: 'none',
  transition: 'opacity 200ms ease-out',
} as const
export const imageLayer = style([background, fade])
export const loadingLayer = style([
  background,
  fade,
  { backgroundColor: vars.color.palette.gray100 },
])
export const marker = style({ pointerEvents: 'none', position: 'absolute' })
export const circle = style([
  marker,
  {
    backgroundColor: vars.color.palette.carrot500,
    borderRadius: '50%',
    height: '96px',
    left: '50%',
    marginLeft: '-48px',
    marginTop: '-48px',
    opacity: 0.3,
    top: '50%',
    width: '96px',
  },
])
export const pin = style([
  marker,
  {
    backgroundColor: vars.color.palette.carrot500,
    border: `3px solid ${vars.color.fg.staticWhite}`,
    borderRadius: '10px',
    height: '20px',
    left: '50%',
    marginLeft: '-10px',
    marginTop: '-10px',
    top: '50%',
    width: '20px',
  },
])
export const walking = style({
  ...typography.t3Bold,
  color: vars.color.palette.blue900,
  marginBottom: '8px',
})
export const meters = style({ fontWeight: '500' })
export const addressRow = style({ ...row })
export const address = style({
  ...typography.t5Regular,
  color: vars.color.fg.neutral,
  flexShrink: 1,
  minWidth: 0,
})
export const copy = style({ ...row, flexShrink: 1, marginLeft: '8px' })
export const copyText = style({
  ...typography.t4Regular,
  color: vars.color.palette.blue900,
  flexShrink: 1,
  marginLeft: '2px',
})
export const icon = style({
  backgroundColor: vars.color.palette.blue900,
  borderRadius: '3px',
  flexShrink: 0,
  height: '14px',
  width: '14px',
})
export const subways = style({ ...column, gap: '8px', marginTop: '16px' })
export const station = style({ ...row, gap: '8px' })
export const lines = style({ ...row, flexShrink: 0, gap: '4px' })
export const line = style({ borderRadius: '1000px', padding: '2px 6px' })
export const lineText = style({
  ...typography.t1Regular,
  color: vars.color.fg.staticWhite,
  fontWeight: '700',
})
export const stationText = style({
  ...typography.t3Regular,
  color: vars.color.fg.neutralMuted,
  flexShrink: 1,
})
export const stationName = style({
  color: vars.color.fg.neutral,
  fontWeight: '700',
})
export const fallback = style({
  ...column,
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'center',
  paddingTop: '13px',
})
export const fallbackButton = style({
  ...row,
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: '6px',
  height: '36px',
  justifyContent: 'center',
  padding: '0 12px',
})
// Native glyph metrics differ from the web view, so the fallback label is tuned as a descendant rule.
globalStyle(`${fallback} text`, {
  ...typography.t4Regular,
  color: vars.color.fg.neutralMuted,
  marginBottom: '1px',
  marginLeft: '4px',
})
