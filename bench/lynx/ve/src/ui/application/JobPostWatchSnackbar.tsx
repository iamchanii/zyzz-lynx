import { useEffect, useState } from '@lynx-js/react'
import * as styles from './JobPostWatchSnackbar.css.js'

/** Bottom snackbar confirming a watch change, auto-closing after a short delay. */
export function JobPostWatchSnackbar(props: JobPostWatchSnackbar.Props) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setClosing(true), 2400)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <view className={styles.region} style={{ bottom: `${props.bottom}px` }}>
      <view
        className={`${styles.surface} ${closing ? styles.closing : styles.opening}`}
        bindanimationend={() => {
          if (closing) props.onClose()
        }}
      >
        <text className={styles.message}>{props.message}</text>
        <view
          className={styles.action}
          accessibility-element={true}
          accessibility-traits="button"
          bindtap={props.onAction}
        >
          <text className={styles.actionLabel}>{props.actionLabel}</text>
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
