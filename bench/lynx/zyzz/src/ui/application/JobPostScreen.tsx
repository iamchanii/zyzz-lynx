import { style, vars } from '../../zyzz.config.js'
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

/** Scrollable body of the job post: header, details, author, map, and recommendation sections. */
export function JobPostScreen(props: JobPostScreen.Props) {
  const noop = () => {}

  return (
    <view {...styles.root()}>
      <JobPostHeader author={author} post={jobPost} />
      <view {...styles.main()}>
        <view {...styles.details()}>
          <JobPostDetails post={jobPost} />
        </view>
        <view {...styles.alarm()}>
          <JobPostFilterAlarmRegistration keyword="카페" region="서초동" />
        </view>
      </view>
      <view {...styles.lowerMain()}>
        <view {...styles.map()}>
          <JobPostMap
            address={jobPost.address}
            mapImage="https://assets.example.invalid/map/static.png"
            onCopyAddress={props.onCopyAddress}
            onOpenMap={noop}
            stations={subwayStations}
          />
        </view>
      </view>
      <view {...styles.linkedDivider()} />
      <JobPostLinkedBizAccount account={linkedBizAccount} />
      <view {...styles.divider()} />
      <view {...styles.author()}>
        <view {...styles.authorInfo()}>
          <JobPostAuthorInfo
            author={author}
            onFollow={noop}
            onReport={noop}
            otherPosts={neighborhoodJobs.slice(0, 2)}
          />
        </view>
        <view {...styles.reviews()}>
          <JobPostAuthorReview
            author={author}
            onMore={noop}
            reviews={reviews}
          />
        </view>
      </view>
      <view {...styles.deepScrollDivider()} />
      <JobPostRecommendedTeacherSection
        onMore={noop}
        onOpenTeacher={noop}
        teachers={teachers}
      />
      <view {...styles.divider()} />
      <JobPostPersonalJobCurationSection
        onMore={noop}
        onOpenPost={noop}
        postsByTab={curationPosts}
        tabs={curationTabs}
        viewerName="에테"
      />
      <view {...styles.divider()} />
      <JobPostPersonalPostsSimilarFeed
        onMore={noop}
        onOpenPost={noop}
        posts={similarPosts}
      />
      <view {...styles.divider()} />
      <JobPostNeighborhoodJobs
        jobs={neighborhoodJobs}
        onMore={noop}
        onOpenPolicy={props.onOpenPolicy}
      />
      <view {...styles.bottomSpace()} />
    </view>
  )
}

export declare namespace JobPostScreen {
  type Props = {
    onCopyAddress(): void
    onOpenPolicy(): void
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

namespace styles {
  export const alarm = style({
    borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
    marginTop: '20px',
    paddingTop: '24px',
  })

  export const author = style({ padding: '28px 0' })

  export const authorInfo = style({ padding: '0 16px' })

  export const bottomSpace = style({ height: '24px' })

  export const details = style({
    borderTop: `1px solid ${vars.color.stroke.neutralSubtle}`,
    marginTop: '20px',
    paddingTop: '24px',
  })

  export const divider = style({
    backgroundColor: 'bg.layerBasement',
    flexShrink: 0,
    height: '8px',
  })

  export const deepScrollDivider = style([divider, { position: 'relative' }])

  export const linkedDivider = style({
    backgroundColor: 'stroke.neutralMuted',
    height: '1px',
    margin: '0 16px',
  })

  export const lowerMain = style({ padding: '0 16px 20px' })

  export const main = style({ padding: '24px 16px 0' })

  export const map = style({ padding: '0 16px 28px' })

  export const reviews = style({ marginTop: '24px' })

  export const root = style({
    ...column,
    backgroundColor: 'bg.layerDefault',
    width: '100%',
  })
}
