import { useEffect, useState } from '@lynx-js/react'
import type { ScrollEvent } from '@lynx-js/types'
import * as styles from './App.css.js'
import { AdvertisementDisplayPolicySheet } from './ui/application/AdvertisementDisplayPolicySheet.js'
import { ProductFooter } from './ui/application/ProductFooter.js'
import { ProductNotificationNudge } from './ui/application/ProductNotificationNudge.js'
import { ProductScreen } from './ui/application/ProductScreen.js'
import { ProductWatchSnackbar } from './ui/application/ProductWatchSnackbar.js'
import { SkeletonTransition } from './ui/general/SkeletonTransition.js'
import { TextSkeleton } from './ui/general/TextSkeleton.js'

const footerHeight = 80
const galleryHeight = 292
const barHeight = 56

type AppState = 'error' | 'loading' | 'ready'

/** Page shell: overlaid app bar, scrolling body, footer, and the floating snackbar and nudge. */
export function App() {
  const [state, setState] = useState<AppState>('loading')
  const [solid, setSolid] = useState(false)
  const [interested, setInterested] = useState(false)
  const [snackbar, setSnackbar] = useState<string | undefined>(undefined)
  const [nudgeVisible, setNudgeVisible] = useState(true)
  const [policyOpen, setPolicyOpen] = useState(false)

  useEffect(() => {
    if (state !== 'loading') return
    const timeout = setTimeout(() => setState('ready'), 800)
    return () => clearTimeout(timeout)
  }, [state])

  function onScroll(event: ScrollEvent) {
    setSolid(event.detail.scrollTop >= galleryHeight - barHeight)
  }

  function onInterestChange(active: boolean) {
    setInterested(active)
    setSnackbar(
      active ? '관심 상품에 저장했어요.' : '관심 상품에서 삭제했어요.',
    )
  }

  if (state === 'error') {
    return (
      <view className={styles.page}>
        <AppBar solid onBack={() => {}} />
        <view className={styles.error}>
          <view className={styles.errorCopy}>
            <text className={styles.errorTitle}>상품을 불러오지 못했어요</text>
            <text className={styles.errorDescription}>
              네트워크 상태를 확인한 뒤 다시 시도해 주세요.
            </text>
          </view>
          <view
            className={styles.textButton}
            bindtap={() => setState('loading')}
          >
            <text className={styles.textButtonLabel}>다시 시도</text>
          </view>
        </view>
      </view>
    )
  }

  return (
    <view className={styles.page}>
      <SkeletonTransition
        fill
        placeholder={state === 'loading' ? <InitialSkeleton /> : undefined}
      >
        <view className={styles.page}>
          <scroll-view
            className={styles.scroll}
            scroll-orientation="vertical"
            bindscroll={onScroll}
          >
            <ProductScreen
              onCopyAddress={() => setSnackbar('주소를 복사했어요.')}
              onOpenPolicy={() => setPolicyOpen(true)}
            />
          </scroll-view>
          <ProductFooter
            interested={interested}
            onInquire={() => setState('error')}
            onInterestChange={onInterestChange}
            onPurchase={() => setSnackbar('장바구니에 담았어요.')}
          />
        </view>
      </SkeletonTransition>
      <AppBar solid={solid} onBack={() => {}} />
      {snackbar !== undefined && (
        <ProductWatchSnackbar
          actionLabel="보기"
          bottom={footerHeight}
          message={snackbar}
          onAction={() => setSnackbar(undefined)}
          onClose={() => setSnackbar(undefined)}
        />
      )}
      {state === 'ready' && nudgeVisible && (
        <ProductNotificationNudge
          bottom={footerHeight}
          onDismiss={() => setNudgeVisible(false)}
          onOpen={() => setNudgeVisible(false)}
        />
      )}
      <AdvertisementDisplayPolicySheet
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
      />
    </view>
  )
}

function AppBar(props: AppBar.Props) {
  return (
    <view
      className={`${styles.bar} ${styles.barOverlay} ${props.solid ? styles.barSolid : ''}`}
    >
      <view
        className={`${styles.barGradient} ${props.solid ? styles.barGradientHidden : ''}`}
      />
      <view className={styles.barRow}>
        <view
          className={styles.barButton}
          accessibility-element={true}
          accessibility-traits="button"
          bindtap={props.onBack}
        >
          <view
            className={`${styles.barGlyph} ${props.solid ? styles.barGlyphSolid : ''}`}
          />
        </view>
        {props.solid && <text className={styles.barTitle}>상품 상세</text>}
        <view className={styles.barActions}>
          <view className={styles.barButton}>
            <view
              className={`${styles.barGlyph} ${props.solid ? styles.barGlyphSolid : ''}`}
            />
          </view>
          <view className={styles.barButton}>
            <view
              className={`${styles.barGlyph} ${props.solid ? styles.barGlyphSolid : ''}`}
            />
          </view>
        </view>
      </view>
    </view>
  )
}

declare namespace AppBar {
  type Props = {
    onBack(): void
    solid: boolean
  }
}

function InitialSkeleton() {
  return (
    <view className={styles.skeleton}>
      <view className={styles.initialThumbnail} />
      <view className={styles.initialBody}>
        <view className={styles.initialHeader}>
          <TextSkeleton size="block" width="80%" />
          <TextSkeleton size="block" width="48%" />
          <TextSkeleton width="60%" />
        </view>
        <view className={styles.initialSeparator} />
        <view className={styles.initialDetails}>
          <view className={styles.initialInfo}>
            {['72%', '56%', '64%', '40%'].map((width) => (
              <view key={width} className={styles.initialInfoRow}>
                <view className={styles.initialInfoIcon} />
                <TextSkeleton width={width} />
              </view>
            ))}
          </view>
        </view>
        <view className={styles.initialText}>
          <TextSkeleton width="100%" />
          <TextSkeleton width="92%" />
          <TextSkeleton width="76%" />
        </view>
        <view className={styles.initialFooter}>
          <view className={styles.initialFooterButton} />
          <view className={styles.initialFooterButton} />
        </view>
      </view>
    </view>
  )
}
