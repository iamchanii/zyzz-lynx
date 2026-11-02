import { style } from '../../zyzz.config.js'

/** Bottom sheet explaining why advertised posts appear in the neighborhood list. */
export function AdvertisementDisplayPolicySheet(
  props: AdvertisementDisplayPolicySheet.Props,
) {
  if (!props.open) return null

  return (
    <view>
      <view {...styles.backdrop()} bindtap={props.onClose} />
      <view {...styles.sheet()}>
        <view {...styles.handle()} />
        <view {...styles.imageArea()}>
          <view {...styles.image()} />
        </view>
        <view {...styles.copy()}>
          <text {...styles.title()}>광고 공고는 이렇게 보여드려요</text>
          <text {...styles.body()}>
            광고 표시가 있는 공고는 사장님이 비용을 지불해 더 많은 이웃에게
            노출돼요. 광고 여부와 관계없이 같은 기준으로 공고를 검수하고, 근무
            조건은 사장님이 직접 작성해요.
          </text>
        </view>
        <view {...styles.footer()}>
          <view
            {...styles.confirm()}
            accessibility-element={true}
            accessibility-traits="button"
            bindtap={props.onClose}
          >
            <text {...styles.confirmLabel()}>확인</text>
          </view>
        </view>
        <view {...styles.safeArea()} />
      </view>
    </view>
  )
}

export declare namespace AdvertisementDisplayPolicySheet {
  type Props = {
    onClose(): void
    open: boolean
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const backdrop = style({
    backgroundColor: 'bg.overlay',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 40,
  })

  export const body = style({
    color: 'palette.gray800',
    typography: 't5Regular',
    whiteSpace: 'normal',
  })

  export const confirm = style({
    ...row,
    backgroundColor: 'bg.brandSolid',
    borderRadius: '6px',
    height: '52px',
    justifyContent: 'center',
    ':active': { backgroundColor: 'palette.carrot600' },
  })

  export const confirmLabel = style({
    color: 'fg.staticWhite',
    typography: 't5Bold',
  })

  export const copy = style({
    ...column,
    gap: '6px',
    padding: '24px 16px 16px',
  })

  export const footer = style({ padding: '12px 16px 8px' })

  export const handle = style({
    alignSelf: 'center',
    backgroundColor: 'palette.gray300',
    borderRadius: '2px',
    height: '4px',
    marginTop: '8px',
    width: '40px',
  })

  export const image = style({
    backgroundColor: 'palette.gray00',
    borderRadius: '8px',
    height: '146px',
    width: '227px',
  })

  export const imageArea = style({
    ...row,
    backgroundColor: 'stroke.neutralSubtle',
    justifyContent: 'center',
    marginTop: '16px',
    paddingBottom: '24px',
    paddingTop: '24px',
  })

  export const safeArea = style({ height: '16rpx' })

  export const sheet = style({
    ...column,
    backgroundColor: 'bg.layerFloating',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    zIndex: 41,
  })

  export const title = style({
    color: 'palette.gray1000',
    typography: 't7Bold',
  })
}
