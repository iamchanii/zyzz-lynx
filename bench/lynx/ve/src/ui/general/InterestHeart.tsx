import { useState } from '@lynx-js/react'
import * as styles from './InterestHeart.css.js'

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
      className={`${styles.root} ${size === 'large' ? styles.large : styles.small}`}
      accessibility-element={true}
      accessibility-traits="button"
      accessibility-label={props.active ? '관심 해제' : '관심 등록'}
      bindtap={toggle}
    >
      <view
        className={`${styles.heart} ${props.active ? styles.filled : ''} ${popping ? styles.popping : ''} ${props.inverted ? styles.inverted : ''}`}
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
