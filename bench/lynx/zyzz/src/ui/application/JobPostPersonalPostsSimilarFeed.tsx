import { useState } from '@lynx-js/react'
import { style, vars } from '../../zyzz.config.js'
import type { SimilarPost } from '../../fixtures.js'
import { Badge } from '../general/Badge.js'

/** Similar job cards with badges and a refresh control that rotates the visible order. */
export function JobPostPersonalPostsSimilarFeed(
  props: JobPostPersonalPostsSimilarFeed.Props,
) {
  const [offset, setOffset] = useState(0)
  const posts = [...props.posts.slice(offset), ...props.posts.slice(0, offset)]

  return (
    <view {...styles.root()}>
      <view {...styles.header()}>
        <text {...styles.heading()}>비슷한 알바</text>
        <view
          {...styles.refresh()}
          bindtap={() =>
            setOffset((offset + 1) % Math.max(props.posts.length, 1))
          }
        >
          <view {...styles.refreshIcon()} />
          <text {...styles.refreshLabel()}>새로고침</text>
        </view>
      </view>
      {posts.map((post) => (
        <view
          key={post.id}
          {...styles.card()}
          bindtap={() => props.onOpenPost(post.id)}
        >
          <view {...styles.cardText()}>
            <text {...styles.title()}>{post.title}</text>
            <text {...styles.company()}>{post.company}</text>
            <text {...styles.conditions()}>{post.workTime}</text>
            <text {...styles.pay()}>{post.pay}</text>
            <view {...styles.badges()}>
              {post.badges.map((badge) => (
                <Badge
                  key={badge.label}
                  label={badge.label}
                  outlined
                  tone={badge.tone}
                />
              ))}
            </view>
          </view>
          <view {...styles.thumbnail()}>
            <image
              {...styles.thumbnailImage()}
              src={post.thumbnail}
              mode="aspectFill"
            />
          </view>
        </view>
      ))}
      <view {...styles.footer()}>
        <view {...styles.footerButton()} bindtap={props.onMore}>
          <text {...styles.footerLabel()}>비슷한 알바 더보기</text>
        </view>
      </view>
    </view>
  )
}

export declare namespace JobPostPersonalPostsSimilarFeed {
  type Props = {
    onMore(): void
    onOpenPost(id: string): void
    posts: readonly SimilarPost[]
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const badges = style({
    ...row,
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '2px',
  })

  export const card = style({
    ...row,
    alignItems: 'flex-start',
    gap: '16px',
    paddingTop: '16px',
  })

  export const cardText = style({
    ...column,
    flexGrow: 1,
    gap: '6px',
    minWidth: 0,
  })

  export const company = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const conditions = style({
    color: 'fg.neutralMuted',
    typography: 't4Regular',
  })

  export const footer = style({
    ...row,
    justifyContent: 'center',
    marginTop: '20px',
  })

  export const footerButton = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '6px',
    height: '40px',
    justifyContent: 'center',
    width: '100%',
  })

  export const footerLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })

  export const header = style({ ...row, justifyContent: 'space-between' })

  export const heading = style({ color: 'fg.neutral', typography: 't6Bold' })

  export const pay = style({ color: 'fg.neutral', typography: 't4Bold' })

  export const refresh = style({ ...row, gap: '4px', minHeight: '32px' })

  export const refreshIcon = style({
    border: `2px solid ${vars.color.fg.neutralSubtle}`,
    borderRadius: '7px',
    borderTopColor: 'bg.transparent',
    height: '14px',
    width: '14px',
  })

  export const refreshLabel = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const root = style({ ...column, padding: '20px 16px', width: '100%' })

  export const thumbnail = style({
    backgroundColor: 'palette.gray200',
    borderRadius: '8px',
    flexShrink: 0,
    height: '72px',
    overflow: 'hidden',
    width: '72px',
  })

  export const thumbnailImage = style({ height: '100%', width: '100%' })

  export const title = style({
    color: 'fg.neutral',
    textOverflow: 'ellipsis',
    typography: 't5Medium',
    whiteSpace: 'nowrap',
  })
}
