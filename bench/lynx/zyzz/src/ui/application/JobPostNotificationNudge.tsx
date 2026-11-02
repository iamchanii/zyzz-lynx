import { useState } from '@lynx-js/react'
import type { AnimationEvent } from '@lynx-js/types'
import { cx } from 'zyzz'
import { keyframes } from 'zyzz/web'
import { style } from '../../zyzz.config.js'

/** Floating notification prompt that enters with a scale animation and exits after a countdown. */
export function JobPostNotificationNudge(
  props: JobPostNotificationNudge.Props,
) {
  const [closing, setClosing] = useState(false)

  function onAnimationEnd(event: AnimationEvent) {
    if (closing && event.params.animation_name !== undefined) props.onDismiss()
  }

  return (
    <view
      {...cx(
        styles.positioner(),
        closing && styles.closing(),
        !closing && styles.opening(),
      )}
      style={{ bottom: `${props.bottom}px` }}
      bindanimationend={onAnimationEnd}
    >
      <view {...styles.surface()}>
        <view {...styles.body()} bindtap={props.onOpen}>
          <view {...styles.bell()} />
          <view {...styles.text()}>
            <text {...styles.title()}>지원 결과를 알림으로 받아보세요</text>
            <text {...styles.description()}>
              사장님이 답장하면 바로 알려드려요
            </text>
          </view>
        </view>
        <view
          {...styles.close()}
          accessibility-element={true}
          accessibility-traits="button"
          accessibility-label="닫기"
          bindtap={() => setClosing(true)}
        >
          <view {...styles.closeGlyph()} />
        </view>
        <view {...styles.progressTrack()}>
          <view
            {...styles.progress()}
            bindanimationend={() => setClosing(true)}
          />
        </view>
      </view>
    </view>
  )
}

export declare namespace JobPostNotificationNudge {
  type Props = {
    bottom: number
    onDismiss(): void
    onOpen(): void
  }
}

const enter = keyframes({
  from: { opacity: 0, transform: 'scale(0)' },
  to: { opacity: 1, transform: 'scale(1)' },
})

const exit = keyframes({
  from: { opacity: 1, transform: 'translateY(0)' },
  to: { opacity: 0, transform: 'translateY(100%)' },
})

const fade = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
const contents = keyframes({
  from: { opacity: 0, transform: 'translateY(30%)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

const countdown = keyframes({
  from: { transform: 'scaleX(1)' },
  to: { transform: 'scaleX(0)' },
})

namespace styles {
  export const bell = style({
    backgroundColor: 'bg.brandWeak',
    borderRadius: '16px',
    flexShrink: 0,
    height: '32px',
    width: '32px',
  })

  export const body = style({
    alignItems: 'center',
    animationDelay: '300ms',
    animationDuration: '300ms',
    animationFillMode: 'both',
    animationName: contents,
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    padding: '16px',
  })

  export const close = style({
    alignItems: 'center',
    animationDelay: '300ms',
    animationDuration: '300ms',
    animationFillMode: 'both',
    animationName: fade,
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '50%',
    display: 'flex',
    height: '28px',
    justifyContent: 'center',
    position: 'absolute',
    right: '12px',
    top: '8px',
    width: '28px',
  })

  export const closeGlyph = style({
    backgroundColor: 'fg.neutralMuted',
    borderRadius: '1px',
    height: '2px',
    transform: 'rotate(45deg)',
    width: '12px',
  })

  export const closing = style({
    animationDuration: '300ms',
    animationFillMode: 'both',
    animationName: exit,
    animationTimingFunction: 'ease-out',
  })

  export const description = style({
    color: 'fg.neutralSubtle',
    typography: 't2Regular',
  })

  export const opening = style({
    animationDuration: '300ms',
    animationFillMode: 'both',
    animationName: enter,
    animationTimingFunction: 'ease-out',
  })

  export const positioner = style({
    left: '16px',
    paddingTop: '8px',
    position: 'absolute',
    right: '16px',
    transformOrigin: 'bottom center',
    zIndex: 20,
  })

  export const progress = style({
    animationDelay: '600ms',
    animationDuration: '6400ms',
    animationFillMode: 'both',
    animationName: countdown,
    animationTimingFunction: 'linear',
    backgroundColor: 'fg.neutral',
    height: '2px',
    transformOrigin: 'left center',
  })

  export const progressTrack = style({
    animationDelay: '300ms',
    animationDuration: '300ms',
    animationFillMode: 'both',
    animationName: fade,
    height: '2px',
  })

  export const surface = style({
    backgroundColor: 'bg.layerFloating',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.16)',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  })

  export const text = style({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    paddingRight: '12px',
  })

  export const title = style({ color: 'fg.neutral', typography: 't4Bold' })
}
