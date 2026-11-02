import { useState } from '@lynx-js/react'
import type { AnimationEvent } from '@lynx-js/types'
import * as styles from './JobPostNotificationNudge.css.js'

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
      className={`${styles.positioner} ${closing ? styles.closing : styles.opening}`}
      style={{ bottom: `${props.bottom}px` }}
      bindanimationend={onAnimationEnd}
    >
      <view className={styles.surface}>
        <view className={styles.body} bindtap={props.onOpen}>
          <view className={styles.bell} />
          <view className={styles.text}>
            <text className={styles.title}>
              지원 결과를 알림으로 받아보세요
            </text>
            <text className={styles.description}>
              사장님이 답장하면 바로 알려드려요
            </text>
          </view>
        </view>
        <view
          className={styles.close}
          accessibility-element={true}
          accessibility-traits="button"
          accessibility-label="닫기"
          bindtap={() => setClosing(true)}
        >
          <view className={styles.closeGlyph} />
        </view>
        <view className={styles.progressTrack}>
          <view
            className={styles.progress}
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
