import type { BadgeTone } from '../../fixtures.js'
import * as styles from './Badge.css.js'

/** Compact label whose background and text color follow a tone. */
export function Badge(props: Badge.Props) {
  return (
    <view
      className={`${styles.root} ${styles.tone[props.tone]} ${props.outlined ? styles.outlined : ''}`}
    >
      <text className={`${styles.label} ${styles.labelTone[props.tone]}`}>
        {props.label}
      </text>
    </view>
  )
}

export declare namespace Badge {
  type Props = {
    label: string
    outlined?: boolean
    tone: BadgeTone
  }
}
