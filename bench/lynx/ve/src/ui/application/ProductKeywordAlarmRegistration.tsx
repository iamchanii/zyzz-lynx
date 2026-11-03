import { useEffect, useState } from '@lynx-js/react'
import { ToggleButton } from '../general/ToggleButton.js'
import * as styles from './ProductKeywordAlarmRegistration.css.js'

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
      <view className={styles.root}>
        <view className={styles.copy}>
          <text className={styles.title}>비슷한 상품 알림 받기</text>
          <text className={styles.description}>
            <text className={styles.highlight}>{props.region}</text>
            {` 근처 ${props.keyword} 상품이 올라오면 알려드려요`}
          </text>
        </view>
        <view className={styles.control}>
          <ToggleButton
            label={registered ? '알림 받는 중' : '알림 받기'}
            loading={loading}
            onPressedChange={() => setLoading(true)}
            pressed={registered}
          />
        </view>
      </view>
      {registered && (
        <text className={styles.registered}>
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
