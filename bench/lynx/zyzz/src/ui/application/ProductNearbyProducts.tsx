import { useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { style, vars } from '../../zyzz.config.js'
import type { NearbyProduct } from '../../fixtures.js'
import { Badge } from '../general/Badge.js'
import { InterestHeart } from '../general/InterestHeart.js'

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
    <view {...styles.root()}>
      <text {...styles.heading()}>이 근처 상품</text>
      {props.products.map((product, index) => (
        <view key={product.id}>
          {index > 0 && <view {...styles.divider()} />}
          {hiddenIds.includes(product.id) ? (
            <view {...styles.card()}>
              <view
                {...styles.hidden()}
                bindtap={() =>
                  setHiddenIds(hiddenIds.filter((id) => id !== product.id))
                }
              >
                <text {...styles.hiddenText()}>
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
        {...cx(
          styles.more(),
          props.products.length === 0 && styles.emptyMore(),
        )}
        bindtap={props.onMore}
      >
        <text {...styles.moreLabel()}>근처 상품 더보기</text>
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
    <view {...cx(styles.card(), props.first && styles.firstCard())}>
      {props.first && (
        <view {...styles.decoration()}>
          <image {...styles.logo()} src={product.thumbnail} />
        </view>
      )}
      <view {...styles.titleRow()}>
        <text {...styles.title()}>{product.title}</text>
        <view {...styles.interest()}>
          <InterestHeart
            active={props.interested}
            onActiveChange={props.onInterestChange}
          />
        </view>
      </view>
      <view {...styles.content()}>
        <view {...styles.information()}>
          <text {...styles.price()}>{product.price}</text>
          <view {...styles.informationRow()}>
            <view {...styles.informationIcon()}>
              <view {...styles.informationGlyph()} />
            </view>
            <view {...styles.fulfillment()}>
              <text {...cx(styles.informationText(), styles.fulfillmentItem())}>
                {`${product.pickup} · ${product.hours}`}
              </text>
            </view>
          </view>
          <view {...styles.informationRow()}>
            <view {...styles.informationIcon()}>
              <view {...styles.informationGlyph()} />
            </view>
            <text
              {...styles.informationText()}
            >{`${product.address} · ${product.distance}`}</text>
          </view>
          <view {...styles.meta()}>
            <text {...cx(styles.metaText(), styles.storeLabel())}>
              {product.store}
            </text>
            <view {...styles.advertisement()} bindtap={props.onHide}>
              <text {...styles.metaText()}>{' · 광고 숨기기'}</text>
            </view>
          </view>
          <view {...styles.badges()}>
            {product.badges.map((badge) => (
              <Badge key={badge.label} label={badge.label} tone={badge.tone} />
            ))}
          </view>
        </view>
        <view {...styles.photo()}>
          <image
            {...styles.photoImage()}
            src={product.thumbnail}
            mode="aspectFill"
          />
          <view {...styles.photoBorder()} />
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

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const advertisement = style({ ...row, flexShrink: 0, gap: '2px' })

  export const storeLabel = style({
    flexShrink: 1,
    minWidth: 0,
    textOverflow: 'ellipsis',
  })

  export const badges = style({
    ...row,
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '4px',
    // Native glyph advances are narrower than the web view's at this 11px size.
    selectors: { '& text': { letterSpacing: '0.2px' } },
  })

  export const card = style({ ...column, padding: '16px' })

  export const content = style({
    ...row,
    alignItems: 'flex-start',
    gap: '12px',
    marginTop: '8px',
  })

  export const decoration = style({
    ...row,
    height: '16px',
    marginBottom: '4px',
  })

  export const divider = style({
    backgroundColor: 'palette.gray200',
    height: '1px',
    marginLeft: '16px',
    marginRight: '16px',
  })

  export const emptyMore = style({ marginTop: '24px' })

  export const firstCard = style({ paddingTop: '24px' })

  export const heading = style({
    color: 'fg.neutral',
    marginLeft: '16px',
    marginRight: '16px',
    typography: 't6Bold',
  })

  export const hidden = style({
    ...row,
    backgroundColor: 'bg.neutralMuted',
    borderRadius: '8px',
    gap: '6px',
    padding: '14px 16px',
  })

  export const hiddenText = style({
    color: 'fg.neutralMuted',
    typography: 't4Regular',
  })

  export const information = style({
    ...column,
    flexGrow: 1,
    flexShrink: 1,
    gap: '4px',
    minWidth: 0,
  })

  export const informationGlyph = style({
    backgroundColor: 'fg.neutralSubtle',
    borderRadius: '3px',
    height: '12px',
    width: '12px',
  })

  export const informationIcon = style({
    ...row,
    flexShrink: 0,
    height: '19px',
  })

  export const informationRow = style({
    ...row,
    alignItems: 'flex-start',
    gap: '4px',
  })

  export const informationText = style({
    color: 'fg.neutralMuted',
    flexShrink: 1,
    minWidth: 0,
    typography: 't4Regular',
  })

  export const interest = style({
    ...row,
    flexShrink: 0,
    height: '20px',
    justifyContent: 'center',
    position: 'relative',
    width: '20px',
  })

  export const logo = style({ flexShrink: 0, height: '16px', width: '48px' })

  export const meta = style({ ...row, minWidth: 0 })

  export const metaText = style({
    color: 'fg.neutralSubtle',
    flexShrink: 0,
    typography: 't2Regular',
  })

  export const more = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '6px',
    height: '40px',
    justifyContent: 'center',
    marginLeft: '16px',
    marginRight: '16px',
    ':active': { backgroundColor: 'bg.neutralWeak' },
  })

  export const moreLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })

  export const price = style({ color: 'fg.neutral', typography: 't4Bold' })

  export const photo = style({
    borderRadius: '6px',
    flexShrink: 0,
    height: '88px',
    overflow: 'hidden',
    position: 'relative',
    width: '88px',
    '@media (max-width: 360px)': { height: '72px', width: '72px' },
  })

  export const photoBorder = style({
    border: `1px solid ${vars.color.stroke.neutralSubtle}`,
    borderRadius: '6px',
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  })

  export const photoImage = style({ height: '100%', width: '100%' })

  export const policyLink = style({
    color: 'fg.neutralSubtle',
    textDecoration: 'underline',
    typography: 't2Regular',
  })

  export const root = style({
    ...column,
    backgroundColor: 'bg.layerDefault',
    paddingBottom: '20px',
    paddingTop: '32px',
    position: 'relative',
    width: '100%',
  })

  export const title = style({
    color: 'fg.neutral',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    textOverflow: 'ellipsis',
    typography: 't5Bold',
  })

  export const titleRow = style({ ...row, gap: '6px' })

  export const fulfillmentItem = style({ maxWidth: '100%' })

  export const fulfillment = style({ flexShrink: 1, minWidth: 0 })
}
