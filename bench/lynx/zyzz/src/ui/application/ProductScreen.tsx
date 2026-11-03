import { style, vars } from '../../zyzz.config.js'
import {
  brands,
  curationProducts,
  curationTabs,
  linkedStore,
  nearbyProducts,
  product,
  reviews,
  seller,
  similarProducts,
  subwayStations,
} from '../../fixtures.js'
import { ProductSellerInfo } from './ProductSellerInfo.js'
import { ProductSellerReview } from './ProductSellerReview.js'
import { ProductDetails } from './ProductDetails.js'
import { ProductKeywordAlarmRegistration } from './ProductKeywordAlarmRegistration.js'
import { ProductHeader } from './ProductHeader.js'
import { ProductLinkedStore } from './ProductLinkedStore.js'
import { ProductStoreMap } from './ProductStoreMap.js'
import { ProductNearbyProducts } from './ProductNearbyProducts.js'
import { ProductPersonalCurationSection } from './ProductPersonalCurationSection.js'
import { ProductSimilarFeed } from './ProductSimilarFeed.js'
import { ProductRecommendedBrandSection } from './ProductRecommendedBrandSection.js'

/** Scrollable body of the product: header, details, seller, map, and recommendation sections. */
export function ProductScreen(props: ProductScreen.Props) {
  const noop = () => {}

  return (
    <view {...styles.root()}>
      <ProductHeader seller={seller} product={product} />
      <view {...styles.main()}>
        <view {...styles.details()}>
          <ProductDetails product={product} />
        </view>
        <view {...styles.alarm()}>
          <ProductKeywordAlarmRegistration keyword="원두" region="연남동" />
        </view>
      </view>
      <view {...styles.lowerMain()}>
        <view {...styles.map()}>
          <ProductStoreMap
            address={product.address}
            mapImage="https://assets.example.invalid/map/static.png"
            onCopyAddress={props.onCopyAddress}
            onOpenMap={noop}
            stations={subwayStations}
          />
        </view>
      </view>
      <view {...styles.linkedDivider()} />
      <ProductLinkedStore store={linkedStore} />
      <view {...styles.divider()} />
      <view {...styles.seller()}>
        <view {...styles.sellerInfo()}>
          <ProductSellerInfo
            seller={seller}
            onFollow={noop}
            onReport={noop}
            otherProducts={nearbyProducts.slice(0, 2)}
          />
        </view>
        <view {...styles.reviews()}>
          <ProductSellerReview
            seller={seller}
            onMore={noop}
            reviews={reviews}
          />
        </view>
      </view>
      <view {...styles.deepScrollDivider()} />
      <ProductRecommendedBrandSection
        onMore={noop}
        onOpenBrand={noop}
        brands={brands}
      />
      <view {...styles.divider()} />
      <ProductPersonalCurationSection
        onMore={noop}
        onOpenProduct={noop}
        productsByTab={curationProducts}
        tabs={curationTabs}
        viewerName="하늘"
      />
      <view {...styles.divider()} />
      <ProductSimilarFeed
        onMore={noop}
        onOpenProduct={noop}
        products={similarProducts}
      />
      <view {...styles.divider()} />
      <ProductNearbyProducts
        products={nearbyProducts}
        onMore={noop}
        onOpenPolicy={props.onOpenPolicy}
      />
      <view {...styles.bottomSpace()} />
    </view>
  )
}

export declare namespace ProductScreen {
  type Props = {
    onCopyAddress(): void
    onOpenPolicy(): void
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

namespace styles {
  export const alarm = style({
    borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
    marginTop: '20px',
    paddingTop: '24px',
  })

  export const seller = style({ padding: '28px 0' })

  export const sellerInfo = style({ padding: '0 16px' })

  export const bottomSpace = style({ height: '24px' })

  export const details = style({
    borderTop: `1px solid ${vars.color.stroke.neutralSubtle}`,
    marginTop: '20px',
    paddingTop: '24px',
  })

  export const divider = style({
    backgroundColor: 'bg.layerBasement',
    flexShrink: 0,
    height: '8px',
  })

  export const deepScrollDivider = style([divider, { position: 'relative' }])

  export const linkedDivider = style({
    backgroundColor: 'stroke.neutralMuted',
    height: '1px',
    margin: '0 16px',
  })

  export const lowerMain = style({ padding: '0 16px 20px' })

  export const main = style({ padding: '24px 16px 0' })

  export const map = style({ padding: '0 16px 28px' })

  export const reviews = style({ marginTop: '24px' })

  export const root = style({
    ...column,
    backgroundColor: 'bg.layerDefault',
    width: '100%',
  })
}
