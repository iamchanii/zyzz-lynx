import { InterestHeart } from '../general/InterestHeart.js'
import * as styles from './ProductFooter.css.js'

/** Sticky footer with the interest heart and the inquiry and purchase actions. */
export function ProductFooter(props: ProductFooter.Props) {
  const closed = props.closed ?? false

  return (
    <view className={styles.root}>
      {closed && (
        <text className={styles.help}>
          품절된 상품이에요. 비슷한 상품을 둘러보세요.
        </text>
      )}
      <view className={styles.actions}>
        <view className={styles.interest}>
          <InterestHeart
            active={props.interested}
            onActiveChange={props.onInterestChange}
            size="large"
          />
        </view>
        <ActionButton
          label="문의하기"
          onTap={props.onInquire}
          size="large"
          tone="neutral"
        />
        <ActionButton
          disabled={closed}
          label="구매하기"
          onTap={props.onPurchase}
          size="large"
          tone="brand"
        />
      </view>
      <view className={styles.safeArea} />
    </view>
  )
}

export declare namespace ProductFooter {
  type Props = {
    closed?: boolean
    interested: boolean
    onInquire(): void
    onInterestChange(active: boolean): void
    onPurchase(): void
  }
}

function ActionButton(props: ActionButton.Props) {
  const disabled = props.disabled ?? false

  return (
    <view
      className={`${styles.button} ${styles.size[props.size]} ${styles.tone[props.tone]} ${disabled ? styles.disabled : ''}`}
      accessibility-element={true}
      accessibility-traits="button"
      accessibility-label={props.label}
      bindtap={() => {
        if (!disabled) props.onTap()
      }}
    >
      <text
        className={`${styles.label} ${styles.labelTone[props.tone]} ${disabled ? styles.disabledLabel : ''}`}
      >
        {props.label}
      </text>
    </view>
  )
}

declare namespace ActionButton {
  type Props = {
    disabled?: boolean
    label: string
    onTap(): void
    size: 'large' | 'medium'
    tone: 'brand' | 'neutral' | 'outline'
  }
}
