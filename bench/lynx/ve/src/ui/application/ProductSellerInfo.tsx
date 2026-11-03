import type { NearbyProduct, Seller } from '../../fixtures.js'
import { SellerCertificationsCallout } from './SellerCertificationsCallout.js'
import * as styles from './ProductSellerInfo.css.js'

/** Seller profile with satisfaction, sales stats, badges, certifications, and other products. */
export function ProductSellerInfo(props: ProductSellerInfo.Props) {
  const seller = props.seller

  return (
    <view className={styles.root}>
      <text className={styles.heading}>판매자 정보</text>
      <view className={styles.profile}>
        <view className={styles.avatar}>
          <image className={styles.avatarImage} src={seller.avatar} />
        </view>
        <view className={styles.identity}>
          <view className={styles.nicknameRow}>
            <text className={styles.nickname}>{seller.nickname}</text>
            <view className={styles.verified} />
          </view>
          <text
            className={styles.summary}
          >{`응답률 ${seller.responseRate} · 후기 ${seller.reviewCount}개`}</text>
        </view>
        <view className={styles.satisfaction}>
          <text className={styles.satisfactionValue}>
            {seller.satisfaction}
          </text>
          <view className={styles.satisfactionTrack}>
            <view className={styles.satisfactionRange} />
          </view>
        </view>
      </view>
      <view className={styles.stats}>
        <view className={styles.stat}>
          <text className={styles.statValue}>{String(seller.saleCount)}</text>
          <text className={styles.statLabel}>판매 횟수</text>
        </view>
        <view className={styles.statSeparator} />
        <view className={styles.stat}>
          <text className={styles.statValue}>{seller.responseRate}</text>
          <text className={styles.statLabel}>응답률</text>
        </view>
        <view className={styles.statSeparator} />
        <view className={styles.stat}>
          <text className={styles.statValue}>{String(seller.reviewCount)}</text>
          <text className={styles.statLabel}>받은 후기</text>
        </view>
      </view>
      <view className={styles.badges}>
        {seller.badges.map((badge) => (
          <view key={badge} className={styles.badge}>
            <view className={styles.badgeIcon} />
            <text className={styles.badgeLabel}>{badge}</text>
          </view>
        ))}
      </view>
      <SellerCertificationsCallout certifications={seller.certifications} />
      <view className={styles.actions}>
        <view className={styles.action} bindtap={props.onFollow}>
          <text className={styles.actionLabel}>판매자 팔로우</text>
        </view>
        <view className={styles.action} bindtap={props.onReport}>
          <text className={styles.actionLabel}>신고하기</text>
        </view>
      </view>
      <view className={styles.otherProducts}>
        <text className={styles.otherProductsTitle}>판매자의 다른 상품</text>
        {props.otherProducts.map((product, index) => (
          <view key={product.id}>
            {index > 0 && <view className={styles.separator} />}
            <view className={styles.otherProduct}>
              <image
                className={styles.otherProductThumbnail}
                src={product.thumbnail}
              />
              <view className={styles.otherProductText}>
                <text className={styles.otherProductTitle}>
                  {product.title}
                </text>
                <text
                  className={styles.otherProductMeta}
                >{`${product.price} · ${product.pickup}`}</text>
              </view>
            </view>
          </view>
        ))}
      </view>
    </view>
  )
}

export declare namespace ProductSellerInfo {
  type Props = {
    seller: Seller
    onFollow(): void
    onReport(): void
    otherProducts: readonly NearbyProduct[]
  }
}
