import { useState } from '@lynx-js/react'
import * as styles from './ToggleButton.css.js'

/** Small neutral toggle with a pressed state and an optional loading overlay. */
export function ToggleButton(props: ToggleButton.Props) {
  const [touching, setTouching] = useState(false)
  const loading = props.loading ?? false
  const disabled = props.disabled ?? false

  return (
    <view
      className={`${styles.root} ${disabled ? styles.disabled : loading || touching ? styles.touching : ''}`}
      accessibility-element={true}
      accessibility-traits="button"
      accessibility-label={props.label}
      bindtap={() => {
        if (disabled || loading) return
        props.onPressedChange(!props.pressed)
      }}
      bindtouchstart={() => setTouching(true)}
      bindtouchend={() => setTouching(false)}
      bindtouchcancel={() => setTouching(false)}
    >
      <view className={`${styles.content} ${loading ? styles.hidden : ''}`}>
        <view
          className={`${styles.icon} ${props.pressed ? styles.iconOn : styles.iconOff}`}
        />
        <text
          className={`${styles.label} ${disabled ? styles.disabledLabel : ''}`}
        >
          {props.label}
        </text>
      </view>
      {loading && (
        <view className={styles.loadingIndicator}>
          <view className={styles.spinner} />
        </view>
      )}
    </view>
  )
}

export declare namespace ToggleButton {
  type Props = {
    disabled?: boolean
    label: string
    loading?: boolean
    onPressedChange(pressed: boolean): void
    pressed: boolean
  }
}
