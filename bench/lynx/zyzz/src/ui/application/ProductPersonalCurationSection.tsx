import { useState } from '@lynx-js/react'
import { style } from '../../zyzz.config.js'
import type { CurationProduct, CurationTab } from '../../fixtures.js'
import { SelectableChip } from '../general/SelectableChip.js'

/** Tabbed curation list where selectable chips switch the visible products. */
export function ProductPersonalCurationSection(
  props: ProductPersonalCurationSection.Props,
) {
  const [selected, setSelected] = useState(props.tabs[0]?.id ?? '')
  const products = props.productsByTab[selected] ?? []

  return (
    <view {...styles.root()}>
      <text {...styles.heading()}>{`${props.viewerName}님을 위한 상품`}</text>
      <view {...styles.tabs()}>
        {props.tabs.map((tab) => (
          <SelectableChip
            key={tab.id}
            checked={tab.id === selected}
            label={tab.label}
            onSelect={() => setSelected(tab.id)}
          />
        ))}
      </view>
      <view {...styles.rows()}>
        {products.map((product, index) => (
          <view key={product.id}>
            {index > 0 && <view {...styles.separator()} />}
            <view
              {...styles.product()}
              bindtap={() => props.onOpenProduct(product.id)}
            >
              <text {...styles.productTitle()}>{product.title}</text>
              <view {...styles.productMetaRow()}>
                <text {...styles.productPrice()}>{product.price}</text>
                <text {...styles.productMeta()}>{product.meta}</text>
              </view>
            </view>
          </view>
        ))}
      </view>
      <view {...styles.more()}>
        <view {...styles.moreButton()} bindtap={props.onMore}>
          <text {...styles.moreLabel()}>상품 더보기</text>
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

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const heading = style({
    color: 'fg.neutral',
    padding: '8px 16px',
    typography: 't6Bold',
  })

  export const more = style({ padding: '8px 16px 24px' })

  export const moreButton = style({
    ...row,
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '6px',
    height: '40px',
    justifyContent: 'center',
  })

  export const moreLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })

  export const product = style({ ...column, gap: '4px', padding: '12px 0' })

  export const productMeta = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const productMetaRow = style({ ...row, gap: '6px' })

  export const productPrice = style({
    color: 'fg.neutral',
    typography: 't4Bold',
  })

  export const productTitle = style({
    color: 'fg.neutral',
    textOverflow: 'ellipsis',
    typography: 't5Medium',
    whiteSpace: 'nowrap',
  })

  export const root = style({ ...column, paddingTop: '16px', width: '100%' })

  export const rows = style({ ...column, padding: '12px 16px' })

  export const separator = style({
    backgroundColor: 'stroke.neutralSubtle',
    height: '1px',
  })

  export const tabs = style({
    ...row,
    gap: '6px',
    height: '56px',
    padding: '8px 16px 12px',
  })
}
