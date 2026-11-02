import {
  author,
  curationPosts,
  curationTabs,
  jobPost,
  linkedBizAccount,
  neighborhoodJobs,
  reviews,
  similarPosts,
  subwayStations,
  teachers,
} from '../../fixtures.js'
import { JobPostAuthorInfo } from './JobPostAuthorInfo.js'
import { JobPostAuthorReview } from './JobPostAuthorReview.js'
import { JobPostDetails } from './JobPostDetails.js'
import { JobPostFilterAlarmRegistration } from './JobPostFilterAlarmRegistration.js'
import { JobPostHeader } from './JobPostHeader.js'
import { JobPostLinkedBizAccount } from './JobPostLinkedBizAccount.js'
import { JobPostMap } from './JobPostMap.js'
import { JobPostNeighborhoodJobs } from './JobPostNeighborhoodJobs.js'
import { JobPostPersonalJobCurationSection } from './JobPostPersonalJobCurationSection.js'
import { JobPostPersonalPostsSimilarFeed } from './JobPostPersonalPostsSimilarFeed.js'
import { JobPostRecommendedTeacherSection } from './JobPostRecommendedTeacherSection.js'
import * as styles from './JobPostScreen.css.js'

/** Scrollable body of the job post: header, details, author, map, and recommendation sections. */
export function JobPostScreen(props: JobPostScreen.Props) {
  const noop = () => {}

  return (
    <view className={styles.root}>
      <JobPostHeader author={author} post={jobPost} />
      <view className={styles.main}>
        <view className={styles.details}>
          <JobPostDetails post={jobPost} />
        </view>
        <view className={styles.alarm}>
          <JobPostFilterAlarmRegistration keyword="카페" region="서초동" />
        </view>
      </view>
      <view className={styles.lowerMain}>
        <view className={styles.map}>
          <JobPostMap
            address={jobPost.address}
            mapImage="https://assets.example.invalid/map/static.png"
            onCopyAddress={props.onCopyAddress}
            onOpenMap={noop}
            stations={subwayStations}
          />
        </view>
      </view>
      <view className={styles.linkedDivider} />
      <JobPostLinkedBizAccount account={linkedBizAccount} />
      <view className={styles.divider} />
      <view className={styles.author}>
        <view className={styles.authorInfo}>
          <JobPostAuthorInfo
            author={author}
            onFollow={noop}
            onReport={noop}
            otherPosts={neighborhoodJobs.slice(0, 2)}
          />
        </view>
        <view className={styles.reviews}>
          <JobPostAuthorReview
            author={author}
            onMore={noop}
            reviews={reviews}
          />
        </view>
      </view>
      <view className={styles.deepScrollDivider} />
      <JobPostRecommendedTeacherSection
        onMore={noop}
        onOpenTeacher={noop}
        teachers={teachers}
      />
      <view className={styles.divider} />
      <JobPostPersonalJobCurationSection
        onMore={noop}
        onOpenPost={noop}
        postsByTab={curationPosts}
        tabs={curationTabs}
        viewerName="에테"
      />
      <view className={styles.divider} />
      <JobPostPersonalPostsSimilarFeed
        onMore={noop}
        onOpenPost={noop}
        posts={similarPosts}
      />
      <view className={styles.divider} />
      <JobPostNeighborhoodJobs
        jobs={neighborhoodJobs}
        onMore={noop}
        onOpenPolicy={props.onOpenPolicy}
      />
      <view className={styles.bottomSpace} />
    </view>
  )
}

export declare namespace JobPostScreen {
  type Props = {
    onCopyAddress(): void
    onOpenPolicy(): void
  }
}
