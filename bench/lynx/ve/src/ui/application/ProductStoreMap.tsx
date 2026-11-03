import { useState } from '@lynx-js/react'
import type { SubwayStation } from '../../fixtures.js'
import * as styles from './ProductStoreMap.css.js'

/** Static map preview with a walking-distance line, address copy action, and subway lines. */
export function ProductStoreMap(props: ProductStoreMap.Props) {
  const [mapFailed, setMapFailed] = useState(false)

  return (
    <view className={styles.root}>
      <text className={styles.heading}>픽업 장소</text>
      <view className={styles.mapRegion}>
        <view className={styles.map}>
          {mapFailed ? (
            <view className={styles.fallback}>
              <text>지도를 불러오지 못했어요.</text>
              <view
                className={styles.fallbackButton}
                bindtap={() => setMapFailed(false)}
              >
                <text>다시 시도</text>
              </view>
            </view>
          ) : (
            <view className={styles.mapFrame} bindtap={props.onOpenMap}>
              <view className={styles.loadingLayer} />
              <image
                className={styles.imageLayer}
                src={props.mapImage}
                binderror={() => setMapFailed(true)}
              />
              <view className={styles.circle} />
              <view className={styles.pin} />
              <view className={styles.border} />
            </view>
          )}
        </view>
      </view>
      <text className={styles.walking}>
        {'도보 8분 '}
        <text className={styles.meters}>(약 600m)</text>
      </text>
      <view className={styles.addressRow}>
        <text className={styles.address}>{props.address}</text>
        <view className={styles.copy} bindtap={props.onCopyAddress}>
          <view className={styles.icon} />
          <text className={styles.copyText}>복사</text>
        </view>
      </view>
      <view className={styles.subways}>
        {props.stations.map((station) => (
          <view key={station.name} className={styles.station}>
            <view className={styles.lines}>
              {station.lines.map((line) => (
                <view
                  key={line.name}
                  className={styles.line}
                  style={{ backgroundColor: line.color }}
                >
                  <text className={styles.lineText}>{line.name}</text>
                </view>
              ))}
            </view>
            <text className={styles.stationText}>
              <text className={styles.stationName}>{station.name}</text>
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
