import { useState } from '@lynx-js/react'
import { style } from '../../zyzz.config.js'

/** Clamped body text with a tap target that reveals the full content. */
export function ExpandableText(props: ExpandableText.Props) {
  const [expanded, setExpanded] = useState(false)
  const clamp = expanded
    ? {}
    : { 'text-maxline': String(props.collapsedLines ?? 6) }

  return (
    <view {...styles.root()}>
      <text {...styles.body()} {...clamp}>
        {props.text}
      </text>
      <view
        {...styles.toggle()}
        accessibility-element={true}
        accessibility-traits="button"
        bindtap={() => setExpanded(!expanded)}
      >
        <text {...styles.toggleLabel()}>{expanded ? '접기' : '더보기'}</text>
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

namespace styles {
  export const body = style({
    color: 'fg.neutral',
    lineHeight: '24px',
    typography: 't5Regular',
    whiteSpace: 'pre-wrap',
  })

  export const root = style({ display: 'flex', flexDirection: 'column' })

  export const toggle = style({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '8px',
    minHeight: '28px',
  })

  export const toggleLabel = style({
    color: 'fg.neutralMuted',
    textDecoration: 'underline',
    typography: 't4Medium',
  })
}
