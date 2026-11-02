import { useEffect, useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { keyframes } from 'zyzz/web'
import { style } from '../../zyzz.config.js'

/** Bottom snackbar confirming a watch change, auto-closing after a short delay. */
export function JobPostWatchSnackbar(props: JobPostWatchSnackbar.Props) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setClosing(true), 2400)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <view {...styles.region()} style={{ bottom: `${props.bottom}px` }}>
      <view
        {...cx(
          styles.surface(),
          closing && styles.closing(),
          !closing && styles.opening(),
        )}
        bindanimationend={() => {
          if (closing) props.onClose()
        }}
      >
        <text {...styles.message()}>{props.message}</text>
        <view
          {...styles.action()}
          accessibility-element={true}
          accessibility-traits="button"
          bindtap={props.onAction}
        >
          <text {...styles.actionLabel()}>{props.actionLabel}</text>
        </view>
      </view>
    </view>
  )
}

export declare namespace JobPostWatchSnackbar {
  type Props = {
    actionLabel: string
    bottom: number
    message: string
    onAction(): void
    onClose(): void
  }
}

const enter = keyframes({
  from: { opacity: 0, transform: 'scale(0.9)' },
  to: { opacity: 1, transform: 'scale(1)' },
})

const exit = keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.9)' },
})

namespace styles {
  export const action = style({
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    margin: '-12px -8px',
    minHeight: '44px',
    padding: '0 8px',
  })

  export const actionLabel = style({
    color: 'palette.carrot500',
    typography: 't4Bold',
  })

  export const closing = style({
    animationDuration: '160ms',
    animationFillMode: 'both',
    animationName: exit,
    animationTimingFunction: 'ease-in',
  })

  export const message = style({
    color: 'fg.neutralInverted',
    flex: 1,
    minWidth: 0,
    typography: 't4Regular',
  })

  export const opening = style({
    animationDuration: '200ms',
    animationFillMode: 'both',
    animationName: enter,
    animationTimingFunction: 'ease-out',
  })

  export const region = style({
    alignItems: 'center',
    display: 'flex',
    left: 0,
    padding: '8px 16px',
    position: 'absolute',
    right: 0,
    zIndex: 30,
  })

  export const surface = style({
    alignItems: 'center',
    backgroundColor: 'bg.neutralInverted',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    justifyContent: 'space-between',
    maxWidth: '560px',
    minHeight: '48px',
    padding: '12px 16px',
    width: '100%',
  })
}
