import { useState } from '@lynx-js/react'
import type { SimilarProduct } from '../../fixtures.js'
import { Badge } from '../general/Badge.js'
import * as styles from './ProductSimilarFeed.css.js'

/** Similar product cards with badges and a refresh control that rotates the visible order. */
export function ProductSimilarFeed(props: ProductSimilarFeed.Props) {
  const [offset, setOffset] = useState(0)
  const products = [
    ...props.products.slice(offset),
    ...props.products.slice(0, offset),
  ]

  return (
    <view className={styles.root}>
      <view className={styles.header}>
        <text className={styles.heading}>비슷한 상품</text>
        <view
          className={styles.refresh}
          bindtap={() =>
            setOffset((offset + 1) % Math.max(props.products.length, 1))
          }
        >
          <view className={styles.refreshIcon} />
          <text className={styles.refreshLabel}>새로고침</text>
        </view>
      </view>
      {products.map((product) => (
        <view
          key={product.id}
          className={styles.card}
          bindtap={() => props.onOpenProduct(product.id)}
        >
          <view className={styles.cardText}>
            <text className={styles.title}>{product.title}</text>
            <text className={styles.store}>{product.store}</text>
            <text className={styles.delivery}>{product.delivery}</text>
            <text className={styles.price}>{product.price}</text>
            <view className={styles.badges}>
              {product.badges.map((badge) => (
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
              src={product.thumbnail}
              mode="aspectFill"
            />
          </view>
        </view>
      ))}
      <view className={styles.footer}>
        <view className={styles.footerButton} bindtap={props.onMore}>
          <text className={styles.footerLabel}>비슷한 상품 더보기</text>
        </view>
      </view>
    </view>
  )
}

export declare namespace ProductSimilarFeed {
  type Props = {
    onMore(): void
    onOpenProduct(id: string): void
    products: readonly SimilarProduct[]
  }
}
