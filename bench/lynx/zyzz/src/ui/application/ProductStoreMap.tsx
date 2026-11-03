import { useState } from '@lynx-js/react'
import { style, vars } from '../../zyzz.config.js'
import type { SubwayStation } from '../../fixtures.js'

/** Static map preview with a walking-distance line, address copy action, and subway lines. */
export function ProductStoreMap(props: ProductStoreMap.Props) {
  const [mapFailed, setMapFailed] = useState(false)

  return (
    <view {...styles.root()}>
      <text {...styles.heading()}>픽업 장소</text>
      <view {...styles.mapRegion()}>
        <view {...styles.map()}>
          {mapFailed ? (
            <view {...styles.fallback()}>
              <text>지도를 불러오지 못했어요.</text>
              <view
                {...styles.fallbackButton()}
                bindtap={() => setMapFailed(false)}
              >
                <text>다시 시도</text>
              </view>
            </view>
          ) : (
            <view {...styles.mapFrame()} bindtap={props.onOpenMap}>
              <view {...styles.loadingLayer()} />
              <image
                {...styles.imageLayer()}
                src={props.mapImage}
                binderror={() => setMapFailed(true)}
              />
              <view {...styles.circle()} />
              <view {...styles.pin()} />
              <view {...styles.border()} />
            </view>
          )}
        </view>
      </view>
      <text {...styles.walking()}>
        {'도보 8분 '}
        <text {...styles.meters()}>(약 600m)</text>
      </text>
      <view {...styles.addressRow()}>
        <text {...styles.address()}>{props.address}</text>
        <view {...styles.copy()} bindtap={props.onCopyAddress}>
          <view {...styles.icon()} />
          <text {...styles.copyText()}>복사</text>
        </view>
      </view>
      <view {...styles.subways()}>
        {props.stations.map((station) => (
          <view key={station.name} {...styles.station()}>
            <view {...styles.lines()}>
              {station.lines.map((line) => (
                <view
                  key={line.name}
                  {...styles.line()}
                  style={{ backgroundColor: line.color }}
                >
                  <text {...styles.lineText()}>{line.name}</text>
                </view>
              ))}
            </view>
            <text {...styles.stationText()}>
              <text {...styles.stationName()}>{station.name}</text>
              {` ${station.walk}`}
            </text>
          </view>
        ))}
      </view>
    </view>
  )
}

export declare namespace ProductStoreMap {
  type Props = {
    address: string
    mapImage: string
    onCopyAddress(): void
    onOpenMap(): void
    stations: readonly SubwayStation[]
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const fade = {
  pointerEvents: 'none',
  transition: 'opacity 200ms ease-out',
} as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const address = style({
    color: 'fg.neutral',
    flexShrink: 1,
    minWidth: 0,
    typography: 't5Regular',
  })

  export const addressRow = style({ ...row })

  export const background = style({
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  })

  export const border = style({
    border: `1px solid ${vars.color.stroke.neutralSubtle}`,
    borderRadius: '10px',
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  })

  export const copy = style({ ...row, flexShrink: 1, marginLeft: '8px' })

  export const copyText = style({
    color: 'palette.blue900',
    flexShrink: 1,
    marginLeft: '2px',
    typography: 't4Regular',
  })

  export const fallback = style({
    ...column,
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    paddingTop: '13px',
    // Native glyph metrics differ from the web view, so the fallback label is tuned as a descendant rule.
    selectors: {
      '& text': {
        color: 'fg.neutralMuted',
        marginBottom: '1px',
        marginLeft: '4px',
        typography: 't4Regular',
      },
    },
  })

  export const fallbackButton = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '6px',
    height: '36px',
    justifyContent: 'center',
    padding: '0 12px',
  })

  export const heading = style({
    color: 'fg.neutral',
    marginBottom: '16px',
    typography: 't6Bold',
  })

  export const icon = style({
    backgroundColor: 'palette.blue900',
    borderRadius: '3px',
    flexShrink: 0,
    height: '14px',
    width: '14px',
  })

  export const imageLayer = style([background, fade])

  export const line = style({ borderRadius: '1000px', padding: '2px 6px' })

  export const lines = style({ ...row, flexShrink: 0, gap: '4px' })

  export const lineText = style({
    color: 'fg.staticWhite',
    fontWeight: 700,
    typography: 't1Regular',
  })

  export const loadingLayer = style([
    background,
    fade,
    { backgroundColor: 'palette.gray100' },
  ])

  export const map = style({
    backgroundColor: 'bg.layerDefault',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  })

  export const mapFrame = style({
    borderRadius: '10px',
    height: '160px',
    overflow: 'hidden',
    position: 'relative',
  })

  export const mapRegion = style({ marginBottom: '16px' })

  export const marker = style({ pointerEvents: 'none', position: 'absolute' })

  export const circle = style([
    marker,
    {
      backgroundColor: 'palette.carrot500',
      borderRadius: '50%',
      height: '96px',
      left: '50%',
      marginLeft: '-48px',
      marginTop: '-48px',
      opacity: 0.3,
      top: '50%',
      width: '96px',
    },
  ])

  export const meters = style({ fontWeight: 500 })

  export const pin = style([
    marker,
    {
      backgroundColor: 'palette.carrot500',
      border: `3px solid ${vars.color.fg.staticWhite}`,
      borderRadius: '10px',
      height: '20px',
      left: '50%',
      marginLeft: '-10px',
      marginTop: '-10px',
      top: '50%',
      width: '20px',
    },
  ])

  export const root = style({ ...column, width: '100%' })

  export const station = style({ ...row, gap: '8px' })

  export const stationName = style({ color: 'fg.neutral', fontWeight: 700 })

  export const stationText = style({
    color: 'fg.neutralMuted',
    flexShrink: 1,
    typography: 't3Regular',
  })

  export const subways = style({ ...column, gap: '8px', marginTop: '16px' })

  export const walking = style({
    color: 'palette.blue900',
    marginBottom: '8px',
    typography: 't3Bold',
  })
}
