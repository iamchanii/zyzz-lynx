import type { Review, Seller } from '../../fixtures.js'
import { CustomerReviewCard } from './CustomerReviewCard.js'
import * as styles from './ProductSellerReview.css.js'

const highlights = [
  { count: 12, label: '친절해요' },
  { count: 9, label: '설명과 같아요' },
  { count: 5, label: '배송이 빨라요' },
] as const

/** Review summary, highlight chips, and the customer review list. */
export function ProductSellerReview(props: ProductSellerReview.Props) {
  return (
    <view className={styles.root}>
      <view className={styles.header}>
        <text className={styles.heading}>
          구매 후기
          <text className={styles.count}>
            {String(props.seller.reviewCount)}
          </text>
        </text>
        <view className={styles.more} bindtap={props.onMore}>
          <text className={styles.moreLabel}>전체보기</text>
        </view>
      </view>
      <view className={styles.summary}>
        <text className={styles.summaryScore}>4.8</text>
        <view className={styles.summaryText}>
          <text className={styles.summaryTitle}>
            구매한 고객 대부분이 추천해요
          </text>
          <text
            className={styles.summaryDescription}
          >{`최근 6개월 후기 ${props.reviews.length}개 기준`}</text>
        </view>
      </view>
      <view className={styles.chips}>
        {highlights.map((highlight) => (
          <view key={highlight.label} className={styles.chip}>
            <text className={styles.chipLabel}>{highlight.label}</text>
            <text className={styles.chipCount}>{String(highlight.count)}</text>
          </view>
        ))}
      </view>
      {props.reviews.length === 0 ? (
        <view className={styles.empty}>
          <text className={styles.emptyText}>아직 작성된 후기가 없어요.</text>
        </view>
      ) : (
        <view className={styles.list}>
          {props.reviews.map((review, index) => (
            <view key={review.id}>
              {index > 0 && <view className={styles.separator} />}
              <CustomerReviewCard review={review} />
            </view>
          ))}
        </view>
      )}
    </view>
  )
}

export declare namespace ProductSellerReview {
  type Props = {
    seller: Seller
    onMore(): void
    reviews: readonly Review[]
  }
}
