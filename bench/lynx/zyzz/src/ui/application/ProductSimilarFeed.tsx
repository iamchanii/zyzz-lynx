import { useState } from '@lynx-js/react'
import { style, vars } from '../../zyzz.config.js'
import type { SimilarProduct } from '../../fixtures.js'
import { Badge } from '../general/Badge.js'

/** Similar product cards with badges and a refresh control that rotates the visible order. */
export function ProductSimilarFeed(props: ProductSimilarFeed.Props) {
  const [offset, setOffset] = useState(0)
  const products = [
    ...props.products.slice(offset),
    ...props.products.slice(0, offset),
  ]

  return (
    <view {...styles.root()}>
      <view {...styles.header()}>
        <text {...styles.heading()}>비슷한 상품</text>
        <view
          {...styles.refresh()}
          bindtap={() =>
            setOffset((offset + 1) % Math.max(props.products.length, 1))
          }
        >
          <view {...styles.refreshIcon()} />
          <text {...styles.refreshLabel()}>새로고침</text>
        </view>
      </view>
      {products.map((product) => (
        <view
          key={product.id}
          {...styles.card()}
          bindtap={() => props.onOpenProduct(product.id)}
        >
          <view {...styles.cardText()}>
            <text {...styles.title()}>{product.title}</text>
            <text {...styles.store()}>{product.store}</text>
            <text {...styles.delivery()}>{product.delivery}</text>
            <text {...styles.price()}>{product.price}</text>
            <view {...styles.badges()}>
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
          <view {...styles.thumbnail()}>
            <image
              {...styles.thumbnailImage()}
              src={product.thumbnail}
              mode="aspectFill"
            />
          </view>
        </view>
      ))}
      <view {...styles.footer()}>
        <view {...styles.footerButton()} bindtap={props.onMore}>
          <text {...styles.footerLabel()}>비슷한 상품 더보기</text>
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

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const badges = style({
    ...row,
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '2px',
  })

  export const card = style({
    ...row,
    alignItems: 'flex-start',
    gap: '16px',
    paddingTop: '16px',
  })

  export const cardText = style({
    ...column,
    flexGrow: 1,
    gap: '6px',
    minWidth: 0,
  })

  export const store = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const delivery = style({
    color: 'fg.neutralMuted',
    typography: 't4Regular',
  })

  export const footer = style({
    ...row,
    justifyContent: 'center',
    marginTop: '20px',
  })

  export const footerButton = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '6px',
    height: '40px',
    justifyContent: 'center',
    width: '100%',
  })

  export const footerLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })

  export const header = style({ ...row, justifyContent: 'space-between' })

  export const heading = style({ color: 'fg.neutral', typography: 't6Bold' })

  export const price = style({ color: 'fg.neutral', typography: 't4Bold' })

  export const refresh = style({ ...row, gap: '4px', minHeight: '32px' })

  export const refreshIcon = style({
    border: `2px solid ${vars.color.fg.neutralSubtle}`,
    borderRadius: '7px',
    borderTopColor: 'bg.transparent',
    height: '14px',
    width: '14px',
  })

  export const refreshLabel = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const root = style({ ...column, padding: '20px 16px', width: '100%' })

  export const thumbnail = style({
    backgroundColor: 'palette.gray200',
    borderRadius: '8px',
    flexShrink: 0,
    height: '72px',
    overflow: 'hidden',
    width: '72px',
  })

  export const thumbnailImage = style({ height: '100%', width: '100%' })

  export const title = style({
    color: 'fg.neutral',
    textOverflow: 'ellipsis',
    typography: 't5Medium',
    whiteSpace: 'nowrap',
  })
}
