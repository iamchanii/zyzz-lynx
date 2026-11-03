import { useState } from '@lynx-js/react'
import type { Brand } from '../../fixtures.js'
import { InterestHeart } from '../general/InterestHeart.js'
import * as styles from './ProductRecommendedBrandSection.css.js'

/** Horizontally scrolling brand cards with ratings, tags, and watch hearts. */
export function ProductRecommendedBrandSection(
  props: ProductRecommendedBrandSection.Props,
) {
  const [watched, setWatched] = useState<readonly string[]>([])

  return (
    <view className={styles.root}>
      <text className={styles.heading}>이 상품과 어울리는 브랜드</text>
      <text className={styles.subheading}>
        원두와 함께 쓰기 좋은 도구를 모았어요
      </text>
      <scroll-view className={styles.scroll} scroll-orientation="horizontal">
        <view className={styles.track}>
          {props.brands.map((brand) => {
            const active = watched.includes(brand.id)
            return (
              <view
                key={brand.id}
                className={styles.card}
                bindtap={() => props.onOpenBrand(brand.id)}
              >
                <view className={styles.photo}>
                  <image
                    className={styles.image}
                    src={brand.photo}
                    mode="aspectFill"
                  />
                  <view className={styles.rating}>
                    <view className={styles.ratingStar} />
                    <text className={styles.ratingText}>{brand.rating}</text>
                  </view>
                </view>
                <view className={styles.body}>
                  <text className={styles.name}>{brand.name}</text>
                  <text className={styles.category}>{brand.category}</text>
                  <text
                    className={styles.productCount}
                  >{`상품 ${brand.productCount}개`}</text>
                  <view className={styles.tags}>
                    {brand.tags.map((tag) => (
                      <view key={tag} className={styles.tag}>
                        <text className={styles.tagLabel}>{tag}</text>
                      </view>
                    ))}
                  </view>
                </view>
                <view className={styles.watch}>
                  <text className={styles.watchLabel}>
                    {active ? '관심 브랜드' : '관심 등록'}
                  </text>
                  <InterestHeart
                    active={active}
                    onActiveChange={(next) =>
                      setWatched(
                        next
                          ? [...watched, brand.id]
                          : watched.filter((id) => id !== brand.id),
                      )
                    }
                  />
                </view>
              </view>
            )
          })}
        </view>
      </scroll-view>
      <view className={styles.more}>
        <view className={styles.moreButton} bindtap={props.onMore}>
          <text className={styles.moreLabel}>브랜드 더보기</text>
        </view>
      </view>
    </view>
  )
}

export declare namespace ProductRecommendedBrandSection {
  type Props = {
    brands: readonly Brand[]
    onMore(): void
    onOpenBrand(id: string): void
  }
}
