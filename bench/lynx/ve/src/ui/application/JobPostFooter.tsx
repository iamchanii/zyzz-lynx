import { InterestHeart } from '../general/InterestHeart.js'
import * as styles from './JobPostFooter.css.js'

/** Sticky footer with the interest heart and the call and apply actions. */
export function JobPostFooter(props: JobPostFooter.Props) {
  const closed = props.closed ?? false

  return (
    <view className={styles.root}>
      {closed && (
        <text className={styles.help}>
          마감된 공고예요. 비슷한 알바를 둘러보세요.
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
          label="전화하기"
          onTap={props.onCall}
          size="large"
          tone="neutral"
        />
        <ActionButton
          disabled={closed}
          label="지원하기"
          onTap={props.onApply}
          size="large"
          tone="brand"
        />
      </view>
      <view className={styles.safeArea} />
    </view>
  )
}

export declare namespace JobPostFooter {
  type Props = {
    closed?: boolean
    interested: boolean
    onApply(): void
    onCall(): void
    onInterestChange(active: boolean): void
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
