import { useState } from '@lynx-js/react'
import * as styles from './SelectableChip.css.js'

/** Outline chip that toggles a selected state and darkens while pressed. */
export function SelectableChip(props: SelectableChip.Props) {
  const [pressed, setPressed] = useState(false)
  const checked = props.checked

  return (
    <view
      className={`${styles.root} ${checked ? styles.selected : ''} ${pressed ? (checked ? styles.selectedPressed : styles.pressed) : ''}`}
      accessibility-element={true}
      accessibility-traits="button"
      accessibility-label={props.label}
      bindtap={props.onSelect}
      bindtouchstart={() => setPressed(true)}
      bindtouchend={() => setPressed(false)}
      bindtouchcancel={() => setPressed(false)}
    >
      <text
        className={`${styles.label} ${checked ? styles.selectedLabel : ''}`}
      >
        {props.label}
      </text>
    </view>
  )
}

export declare namespace SelectableChip {
  type Props = {
    checked: boolean
    label: string
    onSelect(): void
  }
}
