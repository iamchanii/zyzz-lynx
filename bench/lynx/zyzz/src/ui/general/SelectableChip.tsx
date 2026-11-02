import { useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { style, vars } from '../../zyzz.config.js'

/** Outline chip that toggles a selected state and darkens while pressed. */
export function SelectableChip(props: SelectableChip.Props) {
  const [pressed, setPressed] = useState(false)
  const checked = props.checked

  return (
    <view
      {...cx(
        styles.root(),
        checked && styles.selected(),
        pressed && checked && styles.selectedPressed(),
        pressed && !checked && styles.pressed(),
      )}
      accessibility-element={true}
      accessibility-traits="button"
      accessibility-label={props.label}
      bindtap={props.onSelect}
      bindtouchstart={() => setPressed(true)}
      bindtouchend={() => setPressed(false)}
      bindtouchcancel={() => setPressed(false)}
    >
      <text {...cx(styles.label(), checked && styles.selectedLabel())}>
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

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const label = style({
    color: 'fg.neutral',
    padding: '0 2px',
    typography: 't4Medium',
    whiteSpace: 'nowrap',
  })

  export const pressed = style({ backgroundColor: 'bg.neutralWeak' })

  export const root = style({
    ...row,
    backgroundColor: 'bg.layerDefault',
    borderRadius: '1000px',
    boxShadow: `inset 0 0 0 1px ${vars.color.stroke.neutral}`,
    flexShrink: 0,
    height: '36px',
    justifyContent: 'center',
    minWidth: '48px',
    padding: '0 14px',
    '@media (max-width: 360px)': {
      height: '32px',
      padding: '0 10px',
    },
  })

  export const selected = style({
    backgroundColor: 'palette.gray900',
    boxShadow: 'none',
  })

  export const selectedLabel = style({ color: 'palette.gray00' })

  export const selectedPressed = style({ backgroundColor: 'palette.gray800' })
}
