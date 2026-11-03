import { useState } from '@lynx-js/react'
import type { NearbyProduct } from '../../fixtures.js'
import { Badge } from '../general/Badge.js'
import { InterestHeart } from '../general/InterestHeart.js'
import * as styles from './ProductNearbyProducts.css.js'

/** Nearby product list with per-card interest hearts, badges, and an advertisement policy link. */
export function ProductNearbyProducts(props: ProductNearbyProducts.Props) {
  const [interested, setInterested] = useState<readonly string[]>([])
  const [hiddenIds, setHiddenIds] = useState<readonly string[]>([])

  function toggleInterest(id: string, active: boolean) {
    setInterested(
      active ? [...interested, id] : interested.filter((entry) => entry !== id),
    )
  }

  return (
    <view className={styles.root}>
      <text className={styles.heading}>이 근처 상품</text>
      {props.products.map((product, index) => (
        <view key={product.id}>
          {index > 0 && <view className={styles.divider} />}
          {hiddenIds.includes(product.id) ? (
            <view className={styles.card}>
              <view
                className={styles.hidden}
                bindtap={() =>
                  setHiddenIds(hiddenIds.filter((id) => id !== product.id))
                }
              >
                <text className={styles.hiddenText}>
                  이 상품을 숨겼어요. 되돌리려면 눌러주세요.
                </text>
              </view>
            </view>
          ) : (
            <NearbyCard
              first={index === 0}
              interested={interested.includes(product.id)}
              product={product}
              onHide={() => setHiddenIds([...hiddenIds, product.id])}
              onInterestChange={(active) => toggleInterest(product.id, active)}
            />
          )}
        </view>
      ))}
      <view
        className={`${styles.more} ${props.products.length === 0 ? styles.emptyMore : ''}`}
        bindtap={props.onMore}
      >
        <text className={styles.moreLabel}>근처 상품 더보기</text>
      </view>
    </view>
  )
}

export declare namespace ProductNearbyProducts {
  type Props = {
    products: readonly NearbyProduct[]
    onMore(): void
    onOpenPolicy(): void
  }
}

function NearbyCard(props: NearbyCard.Props) {
  const product = props.product

  return (
    <view className={`${styles.card} ${props.first ? styles.firstCard : ''}`}>
      {props.first && (
        <view className={styles.decoration}>
          <image className={styles.logo} src={product.thumbnail} />
        </view>
      )}
      <view className={styles.titleRow}>
        <text className={styles.title}>{product.title}</text>
        <view className={styles.interest}>
          <InterestHeart
            active={props.interested}
            onActiveChange={props.onInterestChange}
          />
        </view>
      </view>
      <view className={styles.content}>
        <view className={styles.information}>
          <text className={styles.price}>{product.price}</text>
          <view className={styles.informationRow}>
            <view className={styles.informationIcon}>
              <view className={styles.informationGlyph} />
            </view>
            <view className={styles.fulfillment}>
              <text
                className={`${styles.informationText} ${styles.fulfillmentItem}`}
              >
                {`${product.pickup} · ${product.hours}`}
              </text>
            </view>
          </view>
          <view className={styles.informationRow}>
            <view className={styles.informationIcon}>
              <view className={styles.informationGlyph} />
            </view>
            <text
              className={styles.informationText}
            >{`${product.address} · ${product.distance}`}</text>
          </view>
          <view className={styles.meta}>
            <text className={`${styles.metaText} ${styles.storeLabel}`}>
              {product.store}
            </text>
            <view className={styles.advertisement} bindtap={props.onHide}>
              <text className={styles.metaText}>{' · 광고 숨기기'}</text>
            </view>
          </view>
          <view className={styles.badges}>
            {product.badges.map((badge) => (
              <Badge key={badge.label} label={badge.label} tone={badge.tone} />
            ))}
          </view>
        </view>
        <view className={styles.photo}>
          <image
            className={styles.photoImage}
            src={product.thumbnail}
            mode="aspectFill"
          />
          <view className={styles.photoBorder} />
        </view>
      </view>
    </view>
  )
}

declare namespace NearbyCard {
  type Props = {
    first: boolean
    interested: boolean
    product: NearbyProduct
    onHide(): void
    onInterestChange(active: boolean): void
  }
}
