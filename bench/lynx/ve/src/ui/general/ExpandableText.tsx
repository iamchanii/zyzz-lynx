import { useState } from '@lynx-js/react'
import * as styles from './ExpandableText.css.js'

/** Clamped body text with a tap target that reveals the full content. */
export function ExpandableText(props: ExpandableText.Props) {
  const [expanded, setExpanded] = useState(false)
  const clamp = expanded
    ? {}
    : { 'text-maxline': String(props.collapsedLines ?? 6) }

  return (
    <view className={styles.root}>
      <text className={styles.body} {...clamp}>
        {props.text}
      </text>
      <view
        className={styles.toggle}
        accessibility-element={true}
        accessibility-traits="button"
        bindtap={() => setExpanded(!expanded)}
      >
        <text className={styles.toggleLabel}>
          {expanded ? '접기' : '더보기'}
        </text>
      </view>
    </view>
  )
}

export declare namespace ExpandableText {
  type Props = {
    collapsedLines?: number
    text: string
  }
}
