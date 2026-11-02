import { style } from '@vanilla-extract/css'
import { typography, vars } from './tokens.js'
import * as footerStyles from './ui/application/JobPostFooter.css.js'

const column = { display: 'flex', flexDirection: 'column' } as const
const row = { display: 'flex', flexDirection: 'row' } as const

export const page = style({
  ...column,
  backgroundColor: vars.color.bg.layerDefault,
  height: '100%',
  position: 'relative',
  width: '100%',
})
export const scroll = style({
  flex: 1,
  minHeight: 0,
  width: '100%',
  // Body elements with a z-index must stay inside the scroll area on Lynx.
  zIndex: 0,
})
export const bar = style({ flexShrink: 0 })
export const barOverlay = style({
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: 10,
})
export const barSolid = style({ backgroundColor: vars.color.bg.layerDefault })
export const barGradient = style({
  backgroundImage:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)',
  height: '88px',
  left: 0,
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  width: '100%',
})
export const barGradientHidden = style({ opacity: 0 })
export const barRow = style({
  ...row,
  alignItems: 'center',
  height: '56px',
  justifyContent: 'space-between',
  padding: '0 8px',
  position: 'relative',
})
export const barActions = style({ ...row })
export const barButton = style({
  ...row,
  alignItems: 'center',
  height: '44px',
  justifyContent: 'center',
  width: '40px',
})
export const barGlyph = style({
  backgroundColor: vars.color.fg.staticWhite,
  borderRadius: '2px',
  height: '18px',
  width: '18px',
})
export const barGlyphSolid = style({ backgroundColor: vars.color.fg.neutral })
export const barTitle = style({
  ...typography.t5Bold,
  color: vars.color.fg.neutral,
  left: '56px',
  position: 'absolute',
  right: '56px',
  textAlign: 'center',
})
export const error = style({
  ...column,
  alignItems: 'center',
  flexGrow: 1,
  gap: '24px',
  justifyContent: 'center',
  padding: '0 24px 19px',
})
export const errorCopy = style({ ...column, alignItems: 'center', gap: '8px' })
export const errorTitle = style({
  ...typography.t6Bold,
  color: vars.color.fg.neutral,
  textAlign: 'center',
})
export const errorDescription = style({
  ...typography.t5Regular,
  color: vars.color.fg.neutralMuted,
  textAlign: 'center',
})
export const textButton = style({
  ...row,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  padding: '0 12px',
})
export const textButtonLabel = style({
  ...typography.t4Medium,
  color: vars.color.fg.neutral,
})
export const skeleton = style({ ...column, flex: 1, overflow: 'hidden' })
export const initialThumbnail = style({
  backgroundColor: vars.color.palette.gray200,
  flexShrink: 0,
  height: '292px',
  width: '100%',
})
export const initialBody = style({
  ...column,
  backgroundColor: vars.color.bg.layerDefault,
  flex: 1,
})
export const initialHeader = style({
  ...column,
  flexShrink: 0,
  gap: '8px',
  padding: '24px 16px 20px',
})
export const initialSeparator = style({
  backgroundColor: vars.color.stroke.neutralSubtle,
  flexShrink: 0,
  height: '1px',
  margin: '0 16px',
})
export const initialDetails = style({
  ...column,
  flexShrink: 0,
  padding: '24px 16px',
})
export const initialInfo = style({ ...column, gap: '12px' })
export const initialInfoRow = style({
  ...row,
  alignItems: 'center',
  gap: '8px',
  height: '22px',
})
export const initialInfoIcon = style({
  backgroundColor: vars.color.palette.gray200,
  borderRadius: '4px',
  height: '16px',
  width: '16px',
})
export const initialText = style({
  ...column,
  gap: '12px',
  padding: '20px 16px',
})
export const initialFooter = style({ ...row, gap: '8px', padding: '12px 16px' })
export const initialFooterButton = style([
  footerStyles.button,
  { backgroundColor: vars.color.palette.gray200, height: '52px' },
])
export const overlayRegion = style({
  bottom: 0,
  left: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
})
