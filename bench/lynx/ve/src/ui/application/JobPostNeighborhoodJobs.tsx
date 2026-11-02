import { useState } from '@lynx-js/react'
import type { NeighborhoodJob } from '../../fixtures.js'
import { Badge } from '../general/Badge.js'
import { InterestHeart } from '../general/InterestHeart.js'
import * as styles from './JobPostNeighborhoodJobs.css.js'

/** Nearby job list with per-card interest hearts, badges, and an advertisement policy link. */
export function JobPostNeighborhoodJobs(props: JobPostNeighborhoodJobs.Props) {
  const [interested, setInterested] = useState<readonly string[]>([])
  const [hiddenIds, setHiddenIds] = useState<readonly string[]>([])

  function toggleInterest(id: string, active: boolean) {
    setInterested(
      active ? [...interested, id] : interested.filter((entry) => entry !== id),
    )
  }

  return (
    <view className={styles.root}>
      <text className={styles.heading}>이 근처 알바</text>
      {props.jobs.map((job, index) => (
        <view key={job.id}>
          {index > 0 && <view className={styles.divider} />}
          {hiddenIds.includes(job.id) ? (
            <view className={styles.card}>
              <view
                className={styles.hidden}
                bindtap={() =>
                  setHiddenIds(hiddenIds.filter((id) => id !== job.id))
                }
              >
                <text className={styles.hiddenText}>
                  이 공고를 숨겼어요. 되돌리려면 눌러주세요.
                </text>
              </view>
            </view>
          ) : (
            <NeighborhoodCard
              first={index === 0}
              interested={interested.includes(job.id)}
              job={job}
              onHide={() => setHiddenIds([...hiddenIds, job.id])}
              onInterestChange={(active) => toggleInterest(job.id, active)}
            />
          )}
        </view>
      ))}
      <view
        className={`${styles.more} ${props.jobs.length === 0 ? styles.emptyMore : ''}`}
        bindtap={props.onMore}
      >
        <text className={styles.moreLabel}>근처 알바 더보기</text>
      </view>
    </view>
  )
}

export declare namespace JobPostNeighborhoodJobs {
  type Props = {
    jobs: readonly NeighborhoodJob[]
    onMore(): void
    onOpenPolicy(): void
  }
}

function NeighborhoodCard(props: NeighborhoodCard.Props) {
  const job = props.job

  return (
    <view className={`${styles.card} ${props.first ? styles.firstCard : ''}`}>
      {props.first && (
        <view className={styles.decoration}>
          <image className={styles.logo} src={job.thumbnail} />
        </view>
      )}
      <view className={styles.titleRow}>
        <text className={styles.title}>{job.title}</text>
        <view className={styles.interest}>
          <InterestHeart
            active={props.interested}
            onActiveChange={props.onInterestChange}
          />
        </view>
      </view>
      <view className={styles.content}>
        <view className={styles.information}>
          <text className={styles.pay}>{job.pay}</text>
          <view className={styles.informationRow}>
            <view className={styles.informationIcon}>
              <view className={styles.informationGlyph} />
            </view>
            <view className={styles.workConditions}>
              <text
                className={`${styles.informationText} ${styles.workConditionItem}`}
              >
                {`${job.workDays} · ${job.workTime}`}
              </text>
            </view>
          </view>
          <view className={styles.informationRow}>
            <view className={styles.informationIcon}>
              <view className={styles.informationGlyph} />
            </view>
            <text
              className={styles.informationText}
            >{`${job.address} · ${job.distance}`}</text>
          </view>
          <view className={styles.meta}>
            <text className={`${styles.metaText} ${styles.authorLabel}`}>
              {job.company}
            </text>
            <view className={styles.advertisement} bindtap={props.onHide}>
              <text className={styles.metaText}>{' · 광고 숨기기'}</text>
            </view>
          </view>
          <view className={styles.badges}>
            {job.badges.map((badge) => (
              <Badge key={badge.label} label={badge.label} tone={badge.tone} />
            ))}
          </view>
        </view>
        <view className={styles.photo}>
          <image
            className={styles.photoImage}
            src={job.thumbnail}
            mode="aspectFill"
          />
          <view className={styles.photoBorder} />
        </view>
      </view>
    </view>
  )
}

declare namespace NeighborhoodCard {
  type Props = {
    first: boolean
    interested: boolean
    job: NeighborhoodJob
    onHide(): void
    onInterestChange(active: boolean): void
  }
}
