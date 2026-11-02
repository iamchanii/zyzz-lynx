import { useState } from '@lynx-js/react'
import type { SimilarPost } from '../../fixtures.js'
import { Badge } from '../general/Badge.js'
import * as styles from './JobPostPersonalPostsSimilarFeed.css.js'

/** Similar job cards with badges and a refresh control that rotates the visible order. */
export function JobPostPersonalPostsSimilarFeed(
  props: JobPostPersonalPostsSimilarFeed.Props,
) {
  const [offset, setOffset] = useState(0)
  const posts = [...props.posts.slice(offset), ...props.posts.slice(0, offset)]

  return (
    <view className={styles.root}>
      <view className={styles.header}>
        <text className={styles.heading}>비슷한 알바</text>
        <view
          className={styles.refresh}
          bindtap={() =>
            setOffset((offset + 1) % Math.max(props.posts.length, 1))
          }
        >
          <view className={styles.refreshIcon} />
          <text className={styles.refreshLabel}>새로고침</text>
        </view>
      </view>
      {posts.map((post) => (
        <view
          key={post.id}
          className={styles.card}
          bindtap={() => props.onOpenPost(post.id)}
        >
          <view className={styles.cardText}>
            <text className={styles.title}>{post.title}</text>
            <text className={styles.company}>{post.company}</text>
            <text className={styles.conditions}>{post.workTime}</text>
            <text className={styles.pay}>{post.pay}</text>
            <view className={styles.badges}>
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
          <view className={styles.thumbnail}>
            <image
              className={styles.thumbnailImage}
              src={post.thumbnail}
              mode="aspectFill"
            />
          </view>
        </view>
      ))}
      <view className={styles.footer}>
        <view className={styles.footerButton} bindtap={props.onMore}>
          <text className={styles.footerLabel}>비슷한 알바 더보기</text>
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
