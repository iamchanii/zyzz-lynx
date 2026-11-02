import { useEffect, useState, type ReactNode } from '@lynx-js/react'
import type { AnimationEvent } from '@lynx-js/types'
import * as styles from './SkeletonTransition.css.js'

function OutgoingPlaceholder(props: OutgoingPlaceholder.Props) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    // A lost layout or animation-end event must not leave an opaque mask indefinitely.
    const timeout = setTimeout(props.onFinish, started ? 1000 : 5000)
    return () => clearTimeout(timeout)
  }, [started, props.onFinish])

  function finish(event: AnimationEvent) {
    if (event.params.animation_name === styles.dismiss) props.onFinish()
  }

  return (
    <view
      className={`${props.fill ? styles.fill : ''} ${styles.outgoing} ${started ? styles.dismissing : ''} ${props.transparent ? styles.transparent : ''}`}
      bindlayoutchange={() => setStarted(true)}
      bindanimationend={finish}
    >
      {props.children}
    </view>
  )
}

declare namespace OutgoingPlaceholder {
  type Props = {
    children: ReactNode
    fill: boolean
    onFinish(): void
    transparent: boolean
  }
}

/** Shows a placeholder, then fades it out over the content once the content arrives. */
export function SkeletonTransition(props: SkeletonTransition.Props) {
  const fill = props.fill ?? false
  const transparent = props.transparent ?? false
  const [retained, setRetained] = useState(props.placeholder)
  const hasContent = props.children !== undefined && props.children !== null
  const exiting = !props.placeholder && !!retained && hasContent

  useEffect(() => {
    if (props.placeholder) setRetained(props.placeholder)
  }, [props.placeholder])

  return (
    <view
      className={`${styles.root} ${fill ? styles.fill : ''} ${exiting ? styles.clipped : ''}`}
    >
      <view className={fill && !props.placeholder ? styles.fill : ''}>
        {!props.placeholder && props.children}
      </view>
      {props.placeholder ? (
        <view key="placeholder" className={fill ? styles.fill : ''}>
          {props.placeholder}
        </view>
      ) : exiting ? (
        <OutgoingPlaceholder
          key="outgoing"
          fill={fill}
          transparent={transparent}
          onFinish={() => setRetained(undefined)}
        >
          {retained}
        </OutgoingPlaceholder>
      ) : null}
    </view>
  )
}

export declare namespace SkeletonTransition {
  type Props = {
    children?: ReactNode
    fill?: boolean
    placeholder?: ReactNode
    transparent?: boolean
  }
}
