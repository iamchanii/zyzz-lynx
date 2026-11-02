import { keyframes, style } from '@vanilla-extract/css'
import { typography, vars } from '../../tokens.js'

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const
const column = { display: 'flex', flexDirection: 'column' } as const

const shimmer = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(100%)' },
})
const holdShineImage = keyframes({
  '0%': { transform: 'translateX(200%)' },
  '100%': { transform: 'translateX(-200%)' },
})
const shimmerTiming = {
  animationDuration: '2.5s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
} as const

export const root = style({ ...column, width: '100%' })
export const gallery = style({
  backgroundColor: vars.color.palette.gray200,
  height: '292px',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
})
export const galleryImage = style({ height: '100%', width: '100%' })
export const galleryTapZone = style({
  bottom: 0,
  position: 'absolute',
  top: 0,
  width: '40%',
})
export const galleryPrev = style({ left: 0 })
export const galleryNext = style({ right: 0 })
export const indicators = style({
  ...row,
  bottom: '12px',
  gap: '6px',
  justifyContent: 'center',
  left: 0,
  position: 'absolute',
  right: 0,
})
export const indicator = style({
  backgroundColor: vars.color.palette.staticWhiteAlpha700,
  borderRadius: '3px',
  height: '6px',
  opacity: 0.5,
  width: '6px',
})
export const activeIndicator = style({ opacity: 1, width: '14px' })
export const counter = style({
  ...typography.t2Bold,
  backgroundColor: vars.color.palette.staticBlackAlpha500,
  borderRadius: '12px',
  bottom: '12px',
  color: vars.color.fg.staticWhite,
  padding: '3px 8px',
  position: 'absolute',
  right: '16px',
})
export const copy = style({ ...column, padding: '24px 16px 20px' })
export const badges = style({ ...row, flexWrap: 'wrap', marginBottom: '8px' })
export const badgeImage = style({ flexShrink: 0, height: '16px' })
export const divider = style({
  backgroundColor: vars.color.stroke.neutralMuted,
  flexShrink: 0,
  height: '16px',
  marginLeft: '8px',
  marginRight: '8px',
  width: '1px',
})
export const staff = style({
  backgroundColor: vars.color.bg.layerDefault,
  flexShrink: 0,
  height: '12px',
  overflow: 'hidden',
  position: 'relative',
  width: '34px',
})
export const staffImage = style({ height: '100%', width: '100%' })
export const shine = style({
  ...shimmerTiming,
  animationName: shimmer,
  bottom: 0,
  left: 0,
  maskImage: `linear-gradient(100deg, ${vars.color.bg.transparent} 0%, ${vars.color.bg.transparent} 35%, ${vars.color.palette.staticWhiteAlpha700} 50%, ${vars.color.bg.transparent} 65%, ${vars.color.bg.transparent} 100%)`,
  maskRepeat: 'no-repeat',
  maskSize: '100% 100%',
  overflow: 'visible',
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  width: '200%',
})
export const shineImage = style({
  ...shimmerTiming,
  animationName: holdShineImage,
  height: '100%',
  pointerEvents: 'none',
  width: '50%',
})
export const title = style({
  ...typography.t8Bold,
  color: vars.color.fg.neutral,
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
  '@media': {
    '(max-width: 360px)': { ...typography.t7Bold },
  },
})
export const closed = style({ color: vars.color.fg.placeholder })
export const metaContainer = style({ marginTop: '8px', position: 'relative' })
export const meta = style({
  ...typography.t4Regular,
  color: vars.color.fg.neutralSubtle,
  whiteSpace: 'normal',
  wordBreak: 'normal',
})
export const metaWithCompanyLogo = style({ textIndent: '32px' })
export const companyLogo = style({
  borderRadius: '12px',
  height: '24px',
  left: 0,
  pointerEvents: 'none',
  position: 'absolute',
  top: '-2px',
  width: '24px',
})
export const review = style({ textDecoration: 'underline' })
export const ai = style({
  ...typography.t1Regular,
  color: vars.color.bg.informativeSolid,
})
