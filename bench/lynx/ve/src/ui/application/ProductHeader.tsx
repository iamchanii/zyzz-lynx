import { useState } from '@lynx-js/react'
import type { Product, Seller } from '../../fixtures.js'
import * as styles from './ProductHeader.css.js'

/** Image gallery with tap paging and indicators, followed by the title and meta line. */
export function ProductHeader(props: ProductHeader.Props) {
  const [index, setIndex] = useState(0)
  const images = props.product.images
  const current = images[index]
  const count = images.length

  function move(delta: number) {
    if (count === 0) return
    setIndex((index + delta + count) % count)
  }

  return (
    <view className={styles.root}>
      <view className={styles.gallery}>
        {current !== undefined && (
          <image
            className={styles.galleryImage}
            src={current}
            mode="aspectFill"
          />
        )}
        <view
          className={`${styles.galleryTapZone} ${styles.galleryPrev}`}
          bindtap={() => move(-1)}
        />
        <view
          className={`${styles.galleryTapZone} ${styles.galleryNext}`}
          bindtap={() => move(1)}
        />
        <view className={styles.indicators}>
          {images.map((image, i) => (
            <view
              key={image}
              className={`${styles.indicator} ${i === index ? styles.activeIndicator : ''}`}
            />
          ))}
        </view>
        <text className={styles.counter}>{`${index + 1} / ${count}`}</text>
      </view>
      <view className={styles.copy}>
        <view className={styles.badges}>
          <image className={styles.badgeImage} src={props.seller.avatar} />
          <view className={styles.divider} />
          <view className={styles.staff}>
            <image className={styles.staffImage} src={props.seller.avatar} />
            <view className={styles.shine}>
              <image className={styles.shineImage} src={props.seller.avatar} />
            </view>
          </view>
        </view>
        <text
          className={`${styles.title} ${props.closed ? styles.closed : ''}`}
        >
          {props.product.title}
        </text>
        <view className={styles.metaContainer}>
          <image className={styles.storeLogo} src={props.seller.avatar} />
          <text className={`${styles.meta} ${styles.metaWithStoreLogo}`}>
            {props.product.storeName}
            {' · '}
            <text
              className={styles.review}
            >{`후기 ${props.seller.reviewCount}`}</text>
            {' · '}
            {props.product.publishedAt}
            {'  '}
            <text className={styles.ai}>AI 요약</text>
          </text>
        </view>
      </view>
    </view>
  )
}

export declare namespace ProductHeader {
  type Props = {
    seller: Seller
    closed?: boolean
    product: Product
  }
}
