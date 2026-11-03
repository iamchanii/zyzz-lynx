import { useState } from '@lynx-js/react'
import type { CurationProduct, CurationTab } from '../../fixtures.js'
import { SelectableChip } from '../general/SelectableChip.js'
import * as styles from './ProductPersonalCurationSection.css.js'

/** Tabbed curation list where selectable chips switch the visible products. */
export function ProductPersonalCurationSection(
  props: ProductPersonalCurationSection.Props,
) {
  const [selected, setSelected] = useState(props.tabs[0]?.id ?? '')
  const products = props.productsByTab[selected] ?? []

  return (
    <view className={styles.root}>
      <text
        className={styles.heading}
      >{`${props.viewerName}님을 위한 상품`}</text>
      <view className={styles.tabs}>
        {props.tabs.map((tab) => (
          <SelectableChip
            key={tab.id}
            checked={tab.id === selected}
            label={tab.label}
            onSelect={() => setSelected(tab.id)}
          />
        ))}
      </view>
      <view className={styles.rows}>
        {products.map((product, index) => (
          <view key={product.id}>
            {index > 0 && <view className={styles.separator} />}
            <view
              className={styles.product}
              bindtap={() => props.onOpenProduct(product.id)}
            >
              <text className={styles.productTitle}>{product.title}</text>
              <view className={styles.productMetaRow}>
                <text className={styles.productPrice}>{product.price}</text>
                <text className={styles.productMeta}>{product.meta}</text>
              </view>
            </view>
          </view>
        ))}
      </view>
      <view className={styles.more}>
        <view className={styles.moreButton} bindtap={props.onMore}>
          <text className={styles.moreLabel}>상품 더보기</text>
        </view>
      </view>
    </view>
  )
}

export declare namespace ProductPersonalCurationSection {
  type Props = {
    onMore(): void
    onOpenProduct(id: string): void
    productsByTab: Readonly<Record<string, readonly CurationProduct[]>>
    tabs: readonly CurationTab[]
    viewerName: string
  }
}
