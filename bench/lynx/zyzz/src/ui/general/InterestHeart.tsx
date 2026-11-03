import { useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { keyframes } from 'zyzz/web'
import { style, vars } from '../../zyzz.config.js'

/** Heart toggle that pops once when it becomes filled. */
export function InterestHeart(props: InterestHeart.Props) {
  const [popping, setPopping] = useState(false)
  const size = props.size ?? 'small'

  function toggle() {
    const next = !props.active
    if (next) setPopping(true)
    props.onActiveChange(next)
  }

  return (
    <view
      {...cx(
        styles.root(),
        size === 'large' && styles.large(),
        size !== 'large' && styles.small(),
      )}
      accessibility-element={true}
      accessibility-traits="button"
      accessibility-label={props.active ? '관심 해제' : '관심 등록'}
      bindtap={toggle}
    >
      <view
        {...cx(
          styles.heart(),
          props.active && styles.filled(),
          popping && styles.popping(),
          props.inverted && styles.inverted(),
        )}
        bindanimationend={() => setPopping(false)}
      />
    </view>
  )
}

export declare namespace InterestHeart {
  type Props = {
    active: boolean
    inverted?: boolean
    onActiveChange(active: boolean): void
    size?: 'large' | 'small'
  }
}

const pop = keyframes({
  '0%': { transform: 'scale(1)' },
  '40%': { transform: 'scale(1.3)' },
  '100%': { transform: 'scale(1)' },
})

namespace styles {
  export const filled = style({
    backgroundColor: 'palette.carrot500',
    borderColor: 'palette.carrot500',
  })

  export const heart = style({
    border: `2px solid ${vars.color.fg.neutralSubtle}`,
    borderRadius: '45% 45% 50% 50%',
    height: '70%',
    transform: 'rotate(45deg)',
    width: '70%',
  })

  export const inverted = style({ borderColor: 'fg.staticWhite' })

  export const large = style({ height: '28px', width: '28px' })

  export const popping = style({
    animationDuration: '320ms',
    animationFillMode: 'both',
    animationName: pop,
    animationTimingFunction: 'ease-out',
  })

  export const root = style({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  })

  export const small = style({ height: '20px', width: '20px' })
}
