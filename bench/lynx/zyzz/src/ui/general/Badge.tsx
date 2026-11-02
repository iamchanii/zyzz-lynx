import { style, variants, vars } from '../../zyzz.config.js'
import type { BadgeTone } from '../../fixtures.js'

/** Compact label whose background and text color follow a tone. */
export function Badge(props: Badge.Props) {
  return (
    <view
      className={styles.root({ outlined: props.outlined, tone: props.tone })}
    >
      <text className={styles.label({ tone: props.tone })}>{props.label}</text>
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

namespace styles {
  export const label = variants({
    base: { fontWeight: 700, typography: 't1Regular', whiteSpace: 'nowrap' },
    selection: 'className',
    variants: {
      tone: {
        brand: { color: 'fg.brand' },
        informative: { color: 'fg.informative' },
        neutral: { color: 'fg.neutralMuted' },
        positive: { color: 'fg.positive' },
      },
    },
  })

  export const root = variants({
    base: {
      alignItems: 'center',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'row',
      flexShrink: 0,
      height: '20px',
      padding: '0 6px',
    },
    defaultVariants: { outlined: false },
    selection: 'className',
    // Axis order is precedence: the outlined background must win over the tone background.
    variants: {
      tone: {
        brand: { backgroundColor: 'bg.brandWeak' },
        informative: { backgroundColor: 'bg.informativeWeak' },
        neutral: { backgroundColor: 'bg.neutralWeak' },
        positive: { backgroundColor: 'bg.positiveWeak' },
      },
      outlined: {
        true: {
          backgroundColor: 'bg.layerDefault',
          border: `1px solid ${vars.color.stroke.neutralMuted}`,
        },
        false: {},
      },
    },
  })
}
