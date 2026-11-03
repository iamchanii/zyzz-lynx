import { style, vars } from '../../zyzz.config.js'
import type { NearbyProduct, Seller } from '../../fixtures.js'
import { SellerCertificationsCallout } from './SellerCertificationsCallout.js'

/** Seller profile with satisfaction, sales stats, badges, certifications, and other products. */
export function ProductSellerInfo(props: ProductSellerInfo.Props) {
  const seller = props.seller

  return (
    <view {...styles.root()}>
      <text {...styles.heading()}>판매자 정보</text>
      <view {...styles.profile()}>
        <view {...styles.avatar()}>
          <image {...styles.avatarImage()} src={seller.avatar} />
        </view>
        <view {...styles.identity()}>
          <view {...styles.nicknameRow()}>
            <text {...styles.nickname()}>{seller.nickname}</text>
            <view {...styles.verified()} />
          </view>
          <text
            {...styles.summary()}
          >{`응답률 ${seller.responseRate} · 후기 ${seller.reviewCount}개`}</text>
        </view>
        <view {...styles.satisfaction()}>
          <text {...styles.satisfactionValue()}>{seller.satisfaction}</text>
          <view {...styles.satisfactionTrack()}>
            <view {...styles.satisfactionRange()} />
          </view>
        </view>
      </view>
      <view {...styles.stats()}>
        <view {...styles.stat()}>
          <text {...styles.statValue()}>{String(seller.saleCount)}</text>
          <text {...styles.statLabel()}>판매 횟수</text>
        </view>
        <view {...styles.statSeparator()} />
        <view {...styles.stat()}>
          <text {...styles.statValue()}>{seller.responseRate}</text>
          <text {...styles.statLabel()}>응답률</text>
        </view>
        <view {...styles.statSeparator()} />
        <view {...styles.stat()}>
          <text {...styles.statValue()}>{String(seller.reviewCount)}</text>
          <text {...styles.statLabel()}>받은 후기</text>
        </view>
      </view>
      <view {...styles.badges()}>
        {seller.badges.map((badge) => (
          <view key={badge} {...styles.badge()}>
            <view {...styles.badgeIcon()} />
            <text {...styles.badgeLabel()}>{badge}</text>
          </view>
        ))}
      </view>
      <SellerCertificationsCallout certifications={seller.certifications} />
      <view {...styles.actions()}>
        <view {...styles.action()} bindtap={props.onFollow}>
          <text {...styles.actionLabel()}>판매자 팔로우</text>
        </view>
        <view {...styles.action()} bindtap={props.onReport}>
          <text {...styles.actionLabel()}>신고하기</text>
        </view>
      </view>
      <view {...styles.otherProducts()}>
        <text {...styles.otherProductsTitle()}>판매자의 다른 상품</text>
        {props.otherProducts.map((product, index) => (
          <view key={product.id}>
            {index > 0 && <view {...styles.separator()} />}
            <view {...styles.otherProduct()}>
              <image
                {...styles.otherProductThumbnail()}
                src={product.thumbnail}
              />
              <view {...styles.otherProductText()}>
                <text {...styles.otherProductTitle()}>{product.title}</text>
                <text
                  {...styles.otherProductMeta()}
                >{`${product.price} · ${product.pickup}`}</text>
              </view>
            </view>
          </view>
        ))}
      </view>
    </view>
  )
}

export declare namespace ProductSellerInfo {
  type Props = {
    seller: Seller
    onFollow(): void
    onReport(): void
    otherProducts: readonly NearbyProduct[]
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const action = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '6px',
    flex: 1,
    height: '40px',
    justifyContent: 'center',
    ':active': { backgroundColor: 'bg.neutralWeak' },
  })

  export const actionLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })

  export const actions = style({ ...row, gap: '8px', marginTop: '16px' })

  export const avatar = style({
    backgroundColor: 'palette.gray200',
    borderRadius: '24px',
    flexShrink: 0,
    height: '48px',
    width: '48px',
  })

  export const avatarImage = style({
    borderRadius: '24px',
    height: '100%',
    width: '100%',
  })

  export const badge = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralSubtle}`,
    borderRadius: '4px',
    gap: '4px',
    padding: '3px 6px',
  })

  export const badgeIcon = style({
    backgroundColor: 'fg.positive',
    borderRadius: '6px',
    height: '12px',
    width: '12px',
  })

  export const badgeLabel = style({
    color: 'fg.neutralMuted',
    typography: 't2Regular',
  })

  export const badges = style({
    ...row,
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '12px',
  })

  export const heading = style({ color: 'fg.neutral', typography: 't6Bold' })

  export const identity = style({ ...column, flex: 1, gap: '2px', minWidth: 0 })

  export const nickname = style({
    color: 'fg.neutral',
    flexShrink: 1,
    minWidth: 0,
    textOverflow: 'ellipsis',
    typography: 't5Bold',
    whiteSpace: 'nowrap',
  })

  export const nicknameRow = style({ ...row, gap: '4px' })

  export const otherProduct = style({
    ...row,
    gap: '12px',
    paddingBottom: '12px',
    paddingTop: '12px',
  })

  export const otherProductMeta = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const otherProducts = style({ ...column, marginTop: '20px' })

  export const otherProductsTitle = style({
    color: 'fg.neutral',
    typography: 't4Bold',
  })

  export const otherProductText = style({
    ...column,
    flex: 1,
    gap: '2px',
    minWidth: 0,
  })

  export const otherProductThumbnail = style({
    backgroundColor: 'palette.gray200',
    borderRadius: '6px',
    flexShrink: 0,
    height: '48px',
    width: '48px',
  })

  export const otherProductTitle = style({
    color: 'fg.neutral',
    textOverflow: 'ellipsis',
    typography: 't4Regular',
    whiteSpace: 'nowrap',
  })

  export const profile = style({ ...row, gap: '12px', marginTop: '16px' })

  export const root = style({ ...column, width: '100%' })

  export const separator = style({
    backgroundColor: 'stroke.neutralSubtle',
    height: '1px',
  })

  export const stat = style({
    ...column,
    alignItems: 'center',
    flex: 1,
    gap: '2px',
  })

  export const statLabel = style({
    color: 'fg.neutralSubtle',
    typography: 't2Regular',
  })

  export const stats = style({
    ...row,
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '10px',
    marginTop: '16px',
    padding: '14px 0',
  })

  export const statSeparator = style({
    backgroundColor: 'stroke.neutralMuted',
    height: '24px',
    width: '1px',
  })

  export const statValue = style({ color: 'fg.neutral', typography: 't5Bold' })

  export const summary = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const satisfaction = style({
    ...column,
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: '4px',
  })

  export const satisfactionRange = style({
    backgroundColor: 'palette.green500',
    borderRadius: '2px',
    height: '100%',
    width: '42%',
  })

  export const satisfactionTrack = style({
    backgroundColor: 'bg.neutralMuted',
    borderRadius: '2px',
    height: '4px',
    overflow: 'hidden',
    width: '56px',
  })

  export const satisfactionValue = style({
    color: 'palette.green500',
    typography: 't5Bold',
  })

  export const verified = style({
    backgroundColor: 'bg.informativeSolid',
    borderRadius: '7px',
    flexShrink: 0,
    height: '14px',
    width: '14px',
  })
}
