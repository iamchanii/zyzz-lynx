import { useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { keyframes } from 'zyzz/web'
import { style, vars } from '../../zyzz.config.js'
import type { Author, JobPost } from '../../fixtures.js'

/** Image gallery with tap paging and indicators, followed by the title and meta line. */
export function JobPostHeader(props: JobPostHeader.Props) {
  const [index, setIndex] = useState(0)
  const images = props.post.images
  const current = images[index]
  const count = images.length

  function move(delta: number) {
    if (count === 0) return
    setIndex((index + delta + count) % count)
  }

  return (
    <view {...styles.root()}>
      <view {...styles.gallery()}>
        {current !== undefined && (
          <image {...styles.galleryImage()} src={current} mode="aspectFill" />
        )}
        <view
          {...cx(styles.galleryTapZone(), styles.galleryPrev())}
          bindtap={() => move(-1)}
        />
        <view
          {...cx(styles.galleryTapZone(), styles.galleryNext())}
          bindtap={() => move(1)}
        />
        <view {...styles.indicators()}>
          {images.map((image, i) => (
            <view
              key={image}
              {...cx(
                styles.indicator(),
                i === index && styles.activeIndicator(),
              )}
            />
          ))}
        </view>
        <text {...styles.counter()}>{`${index + 1} / ${count}`}</text>
      </view>
      <view {...styles.copy()}>
        <view {...styles.badges()}>
          <image {...styles.badgeImage()} src={props.author.avatar} />
          <view {...styles.divider()} />
          <view {...styles.staff()}>
            <image {...styles.staffImage()} src={props.author.avatar} />
            <view {...styles.shine()}>
              <image {...styles.shineImage()} src={props.author.avatar} />
            </view>
          </view>
        </view>
        <text {...cx(styles.title(), props.closed && styles.closed())}>
          {props.post.title}
        </text>
        <view {...styles.metaContainer()}>
          <image {...styles.companyLogo()} src={props.author.avatar} />
          <text {...cx(styles.meta(), styles.metaWithCompanyLogo())}>
            {props.post.companyName}
            {' · '}
            <text
              {...styles.review()}
            >{`후기 ${props.author.reviewCount}`}</text>
            {' · '}
            {props.post.publishedAt}
            {'  '}
            <text {...styles.ai()}>AI 요약</text>
          </text>
        </view>
      </view>
    </view>
  )
}

export declare namespace JobPostHeader {
  type Props = {
    author: Author
    closed?: boolean
    post: JobPost
  }
}

const shimmer = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(100%)' },
})

const holdShineImage = keyframes({
  '0%': { transform: 'translateX(200%)' },
  '100%': { transform: 'translateX(-200%)' },
})

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

const shimmerTiming = {
  animationDuration: '2.5s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
} as const

namespace styles {
  export const activeIndicator = style({ opacity: 1, width: '14px' })

  export const ai = style({
    color: 'bg.informativeSolid',
    typography: 't1Regular',
  })

  export const badgeImage = style({ flexShrink: 0, height: '16px' })

  export const badges = style({ ...row, flexWrap: 'wrap', marginBottom: '8px' })

  export const closed = style({ color: 'fg.placeholder' })

  export const companyLogo = style({
    borderRadius: '12px',
    height: '24px',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: '-2px',
    width: '24px',
  })

  export const copy = style({ ...column, padding: '24px 16px 20px' })

  export const counter = style({
    backgroundColor: 'palette.staticBlackAlpha500',
    borderRadius: '12px',
    bottom: '12px',
    color: 'fg.staticWhite',
    padding: '3px 8px',
    position: 'absolute',
    right: '16px',
    typography: 't2Bold',
  })

  export const divider = style({
    backgroundColor: 'stroke.neutralMuted',
    flexShrink: 0,
    height: '16px',
    marginLeft: '8px',
    marginRight: '8px',
    width: '1px',
  })

  export const gallery = style({
    backgroundColor: 'palette.gray200',
    height: '292px',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  })

  export const galleryImage = style({ height: '100%', width: '100%' })

  export const galleryNext = style({ right: 0 })

  export const galleryPrev = style({ left: 0 })

  export const galleryTapZone = style({
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: '40%',
  })

  export const indicator = style({
    backgroundColor: 'palette.staticWhiteAlpha700',
    borderRadius: '3px',
    height: '6px',
    opacity: 0.5,
    width: '6px',
  })

  export const indicators = style({
    ...row,
    bottom: '12px',
    gap: '6px',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
  })

  export const meta = style({
    color: 'fg.neutralSubtle',
    typography: 't4Regular',
    whiteSpace: 'normal',
    wordBreak: 'normal',
  })

  export const metaContainer = style({ marginTop: '8px', position: 'relative' })

  export const metaWithCompanyLogo = style({ textIndent: '32px' })

  export const review = style({ textDecoration: 'underline' })

  export const root = style({ ...column, width: '100%' })

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

  export const staff = style({
    backgroundColor: 'bg.layerDefault',
    flexShrink: 0,
    height: '12px',
    overflow: 'hidden',
    position: 'relative',
    width: '34px',
  })

  export const staffImage = style({ height: '100%', width: '100%' })

  export const title = style({
    color: 'fg.neutral',
    textOverflow: 'ellipsis',
    typography: 't8Bold',
    whiteSpace: 'normal',
    '@media (max-width: 360px)': { typography: 't7Bold' },
  })
}
