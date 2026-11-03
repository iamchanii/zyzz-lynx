import { style, variants, vars } from '../../zyzz.config.js'
import { InterestHeart } from '../general/InterestHeart.js'

/** Sticky footer with the interest heart and the inquiry and purchase actions. */
export function ProductFooter(props: ProductFooter.Props) {
  const closed = props.closed ?? false

  return (
    <view {...styles.root()}>
      {closed && (
        <text {...styles.help()}>
          품절된 상품이에요. 비슷한 상품을 둘러보세요.
        </text>
      )}
      <view {...styles.actions()}>
        <view {...styles.interest()}>
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
      <view {...styles.safeArea()} />
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
      className={styles.button({
        disabled,
        size: props.size,
        tone: props.tone,
      })}
      accessibility-element={true}
      accessibility-traits="button"
      accessibility-label={props.label}
      bindtap={() => {
        if (!disabled) props.onTap()
      }}
    >
      <text className={styles.label({ disabled, tone: props.tone })}>
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

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const actions = style({ ...row, gap: '8px', padding: '12px 16px' })

  // Axis order is precedence: the disabled background must win over the tone background.
  export const button = variants({
    base: {
      ...row,
      borderRadius: '6px',
      flexBasis: 0,
      flexGrow: 1,
      flexShrink: 1,
      justifyContent: 'center',
      minWidth: 0,
    },
    defaultVariants: { disabled: false },
    selection: 'className',
    variants: {
      size: {
        large: { minHeight: '52px', padding: '0 20px' },
        medium: { minHeight: '44px', padding: '0 16px' },
      },
      tone: {
        brand: {
          backgroundColor: 'bg.brandSolid',
          ':active': { backgroundColor: 'palette.carrot600' },
        },
        neutral: {
          backgroundColor: 'bg.neutralWeak',
          ':active': { backgroundColor: 'bg.neutralMuted' },
        },
        outline: {
          backgroundColor: 'bg.layerDefault',
          border: `1px solid ${vars.color.stroke.neutral}`,
        },
      },
      disabled: {
        true: { backgroundColor: 'bg.disabled' },
        false: {},
      },
    },
  })

  export const help = style({
    color: 'fg.neutralSubtle',
    padding: '12px 16px 0',
    textAlign: 'center',
    typography: 't3Regular',
  })

  export const interest = style({
    ...row,
    flexShrink: 0,
    height: '44px',
    justifyContent: 'center',
    marginRight: '8px',
    width: '32px',
  })

  // Axis order is precedence: the disabled color must win over the tone color.
  export const label = variants({
    base: { typography: 't5Bold', whiteSpace: 'nowrap' },
    defaultVariants: { disabled: false },
    selection: 'className',
    variants: {
      tone: {
        brand: { color: 'fg.staticWhite' },
        neutral: { color: 'fg.neutral' },
        outline: { color: 'fg.neutral' },
      },
      disabled: {
        true: { color: 'fg.disabled' },
        false: {},
      },
    },
  })

  export const root = style({
    backgroundColor: 'bg.layerDefault',
    borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
    flexShrink: 0,
    width: '100%',
  })

  export const safeArea = style({ height: '12rpx' })
}
