import { useEffect, useState } from '@lynx-js/react'
import { style } from '../../zyzz.config.js'
import { ToggleButton } from '../general/ToggleButton.js'

/** Keyword alarm registration with a toggle that shows a short loading state. */
export function ProductKeywordAlarmRegistration(
  props: ProductKeywordAlarmRegistration.Props,
) {
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading) return
    const timeout = setTimeout(() => {
      setLoading(false)
      setRegistered(!registered)
    }, 500)
    return () => clearTimeout(timeout)
  }, [loading, registered])

  return (
    <view>
      <view {...styles.root()}>
        <view {...styles.copy()}>
          <text {...styles.title()}>비슷한 상품 알림 받기</text>
          <text {...styles.description()}>
            <text {...styles.highlight()}>{props.region}</text>
            {` 근처 ${props.keyword} 상품이 올라오면 알려드려요`}
          </text>
        </view>
        <view {...styles.control()}>
          <ToggleButton
            label={registered ? '알림 받는 중' : '알림 받기'}
            loading={loading}
            onPressedChange={() => setLoading(true)}
            pressed={registered}
          />
        </view>
      </view>
      {registered && (
        <text {...styles.registered()}>
          알림을 등록했어요. 설정에서 언제든 바꿀 수 있어요.
        </text>
      )}
    </view>
  )
}

export declare namespace ProductKeywordAlarmRegistration {
  type Props = {
    keyword: string
    region: string
  }
}

namespace styles {
  export const control = style({ flexShrink: 0 })

  export const copy = style({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  })

  export const description = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const highlight = style({ color: 'fg.brand', fontWeight: 700 })

  export const registered = style({
    color: 'fg.positive',
    marginTop: '8px',
    typography: 't3Regular',
  })

  export const root = style({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
  })

  export const title = style({ color: 'fg.neutral', typography: 't5Bold' })
}
