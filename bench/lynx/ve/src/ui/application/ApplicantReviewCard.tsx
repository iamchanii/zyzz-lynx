import { useState } from '@lynx-js/react'
import type { Review } from '../../fixtures.js'
import * as styles from './ApplicantReviewCard.css.js'

/** One applicant review with reviewer identity, body, optional photo, tags, and a helpful toggle. */
export function ApplicantReviewCard(props: ApplicantReviewCard.Props) {
  const [helpful, setHelpful] = useState(false)
  const review = props.review

  return (
    <view className={styles.card}>
      <view className={styles.profile}>
        <view className={styles.avatarFallback} />
        <view className={styles.identity}>
          <text className={styles.nickname}>{review.nickname}</text>
          <text className={styles.time}>{review.time}</text>
        </view>
        <view
          className={styles.menuTrigger}
          accessibility-element={true}
          accessibility-traits="button"
        >
          <view className={styles.menuDot} />
          <view className={styles.menuDot} />
          <view className={styles.menuDot} />
        </view>
      </view>
      <view className={styles.bodyRow}>
        <view className={styles.body}>
          <text className={styles.bodyText}>{review.body}</text>
          <view className={styles.information}>
            <text className={styles.infoLine}>
              <text className={styles.infoLabel}>근무</text>
              {`  ${review.workedAt}`}
            </text>
          </view>
        </view>
        {review.thumbnail !== undefined && (
          <view className={styles.thumbnail}>
            <image
              className={styles.thumbnailImage}
              src={review.thumbnail}
              mode="aspectFill"
            />
            <view className={styles.thumbnailBorder} />
          </view>
        )}
      </view>
      <view className={styles.tags}>
        {review.tags.map((tag) => (
          <view key={tag} className={styles.tag}>
            <text className={styles.tagLabel}>{tag}</text>
          </view>
        ))}
      </view>
      <view className={styles.reaction} bindtap={() => setHelpful(!helpful)}>
        <text
          className={`${styles.reactionLabel} ${helpful ? styles.reactionActive : ''}`}
        >
          {helpful ? '도움이 됐어요 1' : '도움이 됐어요'}
        </text>
      </view>
    </view>
  )
}

export declare namespace ApplicantReviewCard {
  type Props = {
    review: Review
  }
}
