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
import * as styles from './ProductScreen.css.js'

/** Scrollable body of the product: header, details, seller, map, and recommendation sections. */
export function ProductScreen(props: ProductScreen.Props) {
  const noop = () => {}

  return (
    <view className={styles.root}>
      <ProductHeader seller={seller} product={product} />
      <view className={styles.main}>
        <view className={styles.details}>
          <ProductDetails product={product} />
        </view>
        <view className={styles.alarm}>
          <ProductKeywordAlarmRegistration keyword="원두" region="연남동" />
        </view>
      </view>
      <view className={styles.lowerMain}>
        <view className={styles.map}>
          <ProductStoreMap
            address={product.address}
            mapImage="https://assets.example.invalid/map/static.png"
            onCopyAddress={props.onCopyAddress}
            onOpenMap={noop}
            stations={subwayStations}
          />
        </view>
      </view>
      <view className={styles.linkedDivider} />
      <ProductLinkedStore store={linkedStore} />
      <view className={styles.divider} />
      <view className={styles.seller}>
        <view className={styles.sellerInfo}>
          <ProductSellerInfo
            seller={seller}
            onFollow={noop}
            onReport={noop}
            otherProducts={nearbyProducts.slice(0, 2)}
          />
        </view>
        <view className={styles.reviews}>
          <ProductSellerReview
            seller={seller}
            onMore={noop}
            reviews={reviews}
          />
        </view>
      </view>
      <view className={styles.deepScrollDivider} />
      <ProductRecommendedBrandSection
        onMore={noop}
        onOpenBrand={noop}
        brands={brands}
      />
      <view className={styles.divider} />
      <ProductPersonalCurationSection
        onMore={noop}
        onOpenProduct={noop}
        productsByTab={curationProducts}
        tabs={curationTabs}
        viewerName="하늘"
      />
      <view className={styles.divider} />
      <ProductSimilarFeed
        onMore={noop}
        onOpenProduct={noop}
        products={similarProducts}
      />
      <view className={styles.divider} />
      <ProductNearbyProducts
        products={nearbyProducts}
        onMore={noop}
        onOpenPolicy={props.onOpenPolicy}
      />
      <view className={styles.bottomSpace} />
    </view>
  )
}

export declare namespace ProductScreen {
  type Props = {
    onCopyAddress(): void
    onOpenPolicy(): void
  }
}
