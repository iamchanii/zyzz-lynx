import { useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { style, vars } from '../../zyzz.config.js'

/** Small neutral toggle with a pressed state and an optional loading overlay. */
export function ToggleButton(props: ToggleButton.Props) {
  const [touching, setTouching] = useState(false)
  const loading = props.loading ?? false
  const disabled = props.disabled ?? false

  return (
    <view
      {...cx(
        styles.root(),
        disabled && styles.disabled(),
        !disabled && (loading || touching) && styles.touching(),
      )}
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
      <view {...cx(styles.content(), loading && styles.hidden())}>
        <view
          {...cx(
            styles.icon(),
            props.pressed && styles.iconOn(),
            !props.pressed && styles.iconOff(),
          )}
        />
        <text {...cx(styles.label(), disabled && styles.disabledLabel())}>
          {props.label}
        </text>
      </view>
      {loading && (
        <view {...styles.loadingIndicator()}>
          <view {...styles.spinner()} />
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

namespace styles {
  export const content = style({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  })

  export const disabled = style({ backgroundColor: 'bg.disabled' })

  export const disabledLabel = style({ color: 'fg.disabled' })

  export const hidden = style({ opacity: 0 })

  export const icon = style({
    borderRadius: '8px',
    height: '16px',
    width: '16px',
  })

  export const iconOff = style({ border: `2px solid ${vars.color.fg.neutral}` })

  export const iconOn = style({ backgroundColor: 'fg.neutral' })

  export const label = style({
    color: 'fg.neutral',
    typography: 't3Bold',
    whiteSpace: 'nowrap',
  })

  export const loadingIndicator = style({
    alignItems: 'center',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  })

  export const root = style({
    alignItems: 'center',
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    justifyContent: 'center',
    minHeight: '32px',
    padding: '6px 10px',
    position: 'relative',
    ':active': { backgroundColor: 'bg.neutralMuted' },
  })

  export const spinner = style({
    border: `2px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '7px',
    borderTopColor: 'fg.neutral',
    height: '14px',
    width: '14px',
  })

  export const touching = style({ backgroundColor: 'bg.neutralMuted' })
}
