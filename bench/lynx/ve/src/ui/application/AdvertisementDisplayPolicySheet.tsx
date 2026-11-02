import * as styles from './AdvertisementDisplayPolicySheet.css.js'

/** Bottom sheet explaining why advertised posts appear in the neighborhood list. */
export function AdvertisementDisplayPolicySheet(
  props: AdvertisementDisplayPolicySheet.Props,
) {
  if (!props.open) return null

  return (
    <view>
      <view className={styles.backdrop} bindtap={props.onClose} />
      <view className={styles.sheet}>
        <view className={styles.handle} />
        <view className={styles.imageArea}>
          <view className={styles.image} />
        </view>
        <view className={styles.copy}>
          <text className={styles.title}>광고 공고는 이렇게 보여드려요</text>
          <text className={styles.body}>
            광고 표시가 있는 공고는 사장님이 비용을 지불해 더 많은 이웃에게
            노출돼요. 광고 여부와 관계없이 같은 기준으로 공고를 검수하고, 근무
            조건은 사장님이 직접 작성해요.
          </text>
        </view>
        <view className={styles.footer}>
          <view
            className={styles.confirm}
            accessibility-element={true}
            accessibility-traits="button"
            bindtap={props.onClose}
          >
            <text className={styles.confirmLabel}>확인</text>
          </view>
        </view>
        <view className={styles.safeArea} />
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
