import { useEffect, useState } from '@lynx-js/react'
import type { ScrollEvent } from '@lynx-js/types'
import { cx } from 'zyzz'
import { style, vars } from './zyzz.config.js'
import { AdvertisementDisplayPolicySheet } from './ui/application/AdvertisementDisplayPolicySheet.js'
import { JobPostFooter } from './ui/application/JobPostFooter.js'
import { JobPostNotificationNudge } from './ui/application/JobPostNotificationNudge.js'
import { JobPostScreen } from './ui/application/JobPostScreen.js'
import { JobPostWatchSnackbar } from './ui/application/JobPostWatchSnackbar.js'
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
      active ? '관심 알바에 저장했어요.' : '관심 알바에서 삭제했어요.',
    )
  }

  if (state === 'error') {
    return (
      <view {...cx(vars({}), styles.page())}>
        <AppBar solid onBack={() => {}} />
        <view {...styles.error()}>
          <view {...styles.errorCopy()}>
            <text {...styles.errorTitle()}>공고를 불러오지 못했어요</text>
            <text {...styles.errorDescription()}>
              네트워크 상태를 확인한 뒤 다시 시도해 주세요.
            </text>
          </view>
          <view {...styles.textButton()} bindtap={() => setState('loading')}>
            <text {...styles.textButtonLabel()}>다시 시도</text>
          </view>
        </view>
      </view>
    )
  }

  return (
    <view {...cx(vars({}), styles.page())}>
      <SkeletonTransition
        fill
        placeholder={state === 'loading' ? <InitialSkeleton /> : undefined}
      >
        <view {...styles.page()}>
          <scroll-view
            {...styles.scroll()}
            scroll-orientation="vertical"
            bindscroll={onScroll}
          >
            <JobPostScreen
              onCopyAddress={() => setSnackbar('주소를 복사했어요.')}
              onOpenPolicy={() => setPolicyOpen(true)}
            />
          </scroll-view>
          <JobPostFooter
            interested={interested}
            onApply={() => setSnackbar('지원서를 보냈어요.')}
            onCall={() => setState('error')}
            onInterestChange={onInterestChange}
          />
        </view>
      </SkeletonTransition>
      <AppBar solid={solid} onBack={() => {}} />
      {snackbar !== undefined && (
        <JobPostWatchSnackbar
          actionLabel="보기"
          bottom={footerHeight}
          message={snackbar}
          onAction={() => setSnackbar(undefined)}
          onClose={() => setSnackbar(undefined)}
        />
      )}
      {state === 'ready' && nudgeVisible && (
        <JobPostNotificationNudge
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
      {...cx(
        styles.bar(),
        styles.barOverlay(),
        props.solid && styles.barSolid(),
      )}
    >
      <view
        {...cx(styles.barGradient(), props.solid && styles.barGradientHidden())}
      />
      <view {...styles.barRow()}>
        <view
          {...styles.barButton()}
          accessibility-element={true}
          accessibility-traits="button"
          bindtap={props.onBack}
        >
          <view
            {...cx(styles.barGlyph(), props.solid && styles.barGlyphSolid())}
          />
        </view>
        {props.solid && <text {...styles.barTitle()}>알바 공고</text>}
        <view {...styles.barActions()}>
          <view {...styles.barButton()}>
            <view
              {...cx(styles.barGlyph(), props.solid && styles.barGlyphSolid())}
            />
          </view>
          <view {...styles.barButton()}>
            <view
              {...cx(styles.barGlyph(), props.solid && styles.barGlyphSolid())}
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
    <view {...styles.skeleton()}>
      <view {...styles.initialThumbnail()} />
      <view {...styles.initialBody()}>
        <view {...styles.initialHeader()}>
          <TextSkeleton size="block" width="80%" />
          <TextSkeleton size="block" width="48%" />
          <TextSkeleton width="60%" />
        </view>
        <view {...styles.initialSeparator()} />
        <view {...styles.initialDetails()}>
          <view {...styles.initialInfo()}>
            {['72%', '56%', '64%', '40%'].map((width) => (
              <view key={width} {...styles.initialInfoRow()}>
                <view {...styles.initialInfoIcon()} />
                <TextSkeleton width={width} />
              </view>
            ))}
          </view>
        </view>
        <view {...styles.initialText()}>
          <TextSkeleton width="100%" />
          <TextSkeleton width="92%" />
          <TextSkeleton width="76%" />
        </view>
        <view {...styles.initialFooter()}>
          <view {...styles.initialFooterButton()} />
          <view {...styles.initialFooterButton()} />
        </view>
      </view>
    </view>
  )
}

const column = { display: 'flex', flexDirection: 'column' } as const

const row = { display: 'flex', flexDirection: 'row' } as const

namespace styles {
  export const bar = style({ flexShrink: 0 })

  export const barActions = style({ ...row })

  export const barButton = style({
    ...row,
    alignItems: 'center',
    height: '44px',
    justifyContent: 'center',
    width: '40px',
  })

  export const barGlyph = style({
    backgroundColor: 'fg.staticWhite',
    borderRadius: '2px',
    height: '18px',
    width: '18px',
  })

  export const barGlyphSolid = style({ backgroundColor: 'fg.neutral' })

  export const barGradient = style({
    backgroundImage:
      'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)',
    height: '88px',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: '100%',
  })

  export const barGradientHidden = style({ opacity: 0 })

  export const barOverlay = style({
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  })

  export const barRow = style({
    ...row,
    alignItems: 'center',
    height: '56px',
    justifyContent: 'space-between',
    padding: '0 8px',
    position: 'relative',
  })

  export const barSolid = style({ backgroundColor: 'bg.layerDefault' })

  export const barTitle = style({
    color: 'fg.neutral',
    left: '56px',
    position: 'absolute',
    right: '56px',
    textAlign: 'center',
    typography: 't5Bold',
  })

  export const error = style({
    ...column,
    alignItems: 'center',
    flexGrow: 1,
    gap: '24px',
    justifyContent: 'center',
    padding: '0 24px 19px',
  })

  export const errorCopy = style({
    ...column,
    alignItems: 'center',
    gap: '8px',
  })

  export const errorDescription = style({
    color: 'fg.neutralMuted',
    textAlign: 'center',
    typography: 't5Regular',
  })

  export const errorTitle = style({
    color: 'fg.neutral',
    textAlign: 'center',
    typography: 't6Bold',
  })

  export const initialBody = style({
    ...column,
    backgroundColor: 'bg.layerDefault',
    flex: 1,
  })

  export const initialDetails = style({
    ...column,
    flexShrink: 0,
    padding: '24px 16px',
  })

  export const initialFooter = style({
    ...row,
    gap: '8px',
    padding: '12px 16px',
  })

  // Mirrors the footer button's base declarations, which live in a recipe that `style` cannot compose.
  export const initialFooterButton = style({
    ...row,
    alignItems: 'center',
    backgroundColor: 'palette.gray200',
    borderRadius: '6px',
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    height: '52px',
    justifyContent: 'center',
    minWidth: 0,
  })

  export const initialHeader = style({
    ...column,
    flexShrink: 0,
    gap: '8px',
    padding: '24px 16px 20px',
  })

  export const initialInfo = style({ ...column, gap: '12px' })

  export const initialInfoIcon = style({
    backgroundColor: 'palette.gray200',
    borderRadius: '4px',
    height: '16px',
    width: '16px',
  })

  export const initialInfoRow = style({
    ...row,
    alignItems: 'center',
    gap: '8px',
    height: '22px',
  })

  export const initialSeparator = style({
    backgroundColor: 'stroke.neutralSubtle',
    flexShrink: 0,
    height: '1px',
    margin: '0 16px',
  })

  export const initialText = style({
    ...column,
    gap: '12px',
    padding: '20px 16px',
  })

  export const initialThumbnail = style({
    backgroundColor: 'palette.gray200',
    flexShrink: 0,
    height: '292px',
    width: '100%',
  })

  export const overlayRegion = style({
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  })

  export const page = style({
    ...column,
    backgroundColor: 'bg.layerDefault',
    height: '100%',
    position: 'relative',
    width: '100%',
  })

  export const scroll = style({
    flex: 1,
    minHeight: 0,
    width: '100%',
    // Body elements with a z-index must stay inside the scroll area on Lynx.
    zIndex: 0,
  })

  export const skeleton = style({ ...column, flex: 1, overflow: 'hidden' })

  export const textButton = style({
    ...row,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '0 12px',
  })

  export const textButtonLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })
}
