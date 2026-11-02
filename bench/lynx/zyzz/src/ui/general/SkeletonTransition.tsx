import { useEffect, useState, type ReactNode } from '@lynx-js/react'
import type { AnimationEvent } from '@lynx-js/types'
import { cx } from 'zyzz'
import { keyframes } from 'zyzz/web'
import { style } from '../../zyzz.config.js'

function OutgoingPlaceholder(props: OutgoingPlaceholder.Props) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    // A lost layout or animation-end event must not leave an opaque mask indefinitely.
    const timeout = setTimeout(props.onFinish, started ? 1000 : 5000)
    return () => clearTimeout(timeout)
  }, [started, props.onFinish])

  function finish(event: AnimationEvent) {
    if (event.params.animation_name === dismiss) props.onFinish()
  }

  return (
    <view
      {...cx(
        props.fill && styles.fill(),
        styles.outgoing(),
        started && styles.dismissing(),
        props.transparent && styles.transparent(),
      )}
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
      {...cx(styles.root(), fill && styles.fill(), exiting && styles.clipped())}
    >
      <view {...cx(fill && !props.placeholder && styles.fill())}>
        {!props.placeholder && props.children}
      </view>
      {props.placeholder ? (
        <view key="placeholder" {...cx(fill && styles.fill())}>
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

const dismiss = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } })

namespace styles {
  export const clipped = style({ overflow: 'hidden' })

  export const dismissing = style({
    animationDuration: '180ms',
    animationFillMode: 'both',
    animationName: dismiss,
    animationTimingFunction: 'ease-out',
  })

  export const fill = style({ height: '100%', width: '100%' })

  export const outgoing = style({
    backgroundColor: 'bg.layerDefault',
    height: '100%',
    left: 0,
    opacity: 1,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 20,
  })

  export const root = style({ position: 'relative', width: '100%' })

  export const transparent = style({ backgroundColor: 'transparent !custom' })
}
