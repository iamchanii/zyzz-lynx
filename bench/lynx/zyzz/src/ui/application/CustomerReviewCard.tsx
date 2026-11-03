import { useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { style, vars } from '../../zyzz.config.js'
import type { Review } from '../../fixtures.js'

/** One customer review with reviewer identity, body, optional photo, tags, and a helpful toggle. */
export function CustomerReviewCard(props: CustomerReviewCard.Props) {
  const [helpful, setHelpful] = useState(false)
  const review = props.review

  return (
    <view {...styles.card()}>
      <view {...styles.profile()}>
        <view {...styles.avatarFallback()} />
        <view {...styles.identity()}>
          <text {...styles.nickname()}>{review.nickname}</text>
          <text {...styles.time()}>{review.time}</text>
        </view>
        <view
          {...styles.menuTrigger()}
          accessibility-element={true}
          accessibility-traits="button"
        >
          <view {...styles.menuDot()} />
          <view {...styles.menuDot()} />
          <view {...styles.menuDot()} />
        </view>
      </view>
      <view {...styles.bodyRow()}>
        <view {...styles.body()}>
          <text {...styles.bodyText()}>{review.body}</text>
          <view {...styles.information()}>
            <text {...styles.infoLine()}>
              <text {...styles.infoLabel()}>구매</text>
              {`  ${review.purchasedAt}`}
            </text>
          </view>
        </view>
        {review.thumbnail !== undefined && (
          <view {...styles.thumbnail()}>
            <image
              {...styles.thumbnailImage()}
              src={review.thumbnail}
              mode="aspectFill"
            />
            <view {...styles.thumbnailBorder()} />
          </view>
        )}
      </view>
      <view {...styles.tags()}>
        {review.tags.map((tag) => (
          <view key={tag} {...styles.tag()}>
            <text {...styles.tagLabel()}>{tag}</text>
          </view>
        ))}
      </view>
      <view {...styles.reaction()} bindtap={() => setHelpful(!helpful)}>
        <text
          {...cx(styles.reactionLabel(), helpful && styles.reactionActive())}
        >
          {helpful ? '도움이 됐어요 1' : '도움이 됐어요'}
        </text>
      </view>
    </view>
  )
}

export declare namespace CustomerReviewCard {
  type Props = {
    review: Review
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const avatar = style({
    borderRadius: '50%',
    flexShrink: 0,
    height: '24px',
    width: '24px',
  })

  export const avatarFallback = style([
    avatar,
    { backgroundColor: 'palette.gray500' },
  ])

  export const body = style({ ...column, flex: 1, minWidth: 0 })

  export const bodyRow = style({ ...row, alignItems: 'flex-start', gap: '7px' })

  export const bodyText = style({
    color: 'fg.neutral',
    lineHeight: '21px',
    typography: 't4Regular',
    whiteSpace: 'normal',
  })

  export const card = style({ ...column, padding: '20px 0' })

  export const identity = style({
    ...row,
    flex: 1,
    flexWrap: 'wrap',
    gap: '4px',
    marginLeft: '8px',
    minWidth: 0,
  })

  export const infoLabel = style({ fontWeight: 700 })

  export const infoLine = style({
    color: 'palette.gray700',
    typography: 't3Regular',
  })

  export const information = style({ ...column, gap: '2px', marginTop: '6px' })

  export const menuDot = style({
    backgroundColor: 'fg.neutralSubtle',
    borderRadius: '2px',
    height: '4px',
    marginLeft: '2px',
    width: '4px',
  })

  export const menuTrigger = style({
    ...row,
    flexShrink: 0,
    marginLeft: '10px',
  })

  export const nickname = style({ color: 'fg.neutral', typography: 't4Bold' })

  export const profile = style({ ...row, marginBottom: '10px' })

  export const reaction = style({
    ...row,
    gap: '4px',
    marginTop: '12px',
    minHeight: '28px',
  })

  export const reactionActive = style({ color: 'fg.brand', fontWeight: 700 })

  export const reactionLabel = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const tag = style({
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '4px',
    padding: '3px 6px',
  })

  export const tagLabel = style({
    color: 'fg.neutralMuted',
    typography: 't2Regular',
  })

  export const tags = style({
    ...row,
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '10px',
  })

  export const thumbnail = style({
    borderRadius: '6px',
    flexShrink: 0,
    height: '48px',
    overflow: 'hidden',
    position: 'relative',
    width: '48px',
  })

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

  export const thumbnailImage = style({ height: '100%', width: '100%' })

  export const time = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })
}
