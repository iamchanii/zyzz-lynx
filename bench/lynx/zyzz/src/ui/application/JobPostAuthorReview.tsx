import { style, vars } from '../../zyzz.config.js'
import type { Author, Review } from '../../fixtures.js'
import { ApplicantReviewCard } from './ApplicantReviewCard.js'

const highlights = [
  { count: 12, label: '친절해요' },
  { count: 9, label: '급여가 정확해요' },
  { count: 5, label: '시간 약속을 지켜요' },
] as const

/** Review summary, highlight chips, and the applicant review list. */
export function JobPostAuthorReview(props: JobPostAuthorReview.Props) {
  return (
    <view {...styles.root()}>
      <view {...styles.header()}>
        <text {...styles.heading()}>
          알바생 후기
          <text {...styles.count()}>{String(props.author.reviewCount)}</text>
        </text>
        <view {...styles.more()} bindtap={props.onMore}>
          <text {...styles.moreLabel()}>전체보기</text>
        </view>
      </view>
      <view {...styles.summary()}>
        <text {...styles.summaryScore()}>4.8</text>
        <view {...styles.summaryText()}>
          <text {...styles.summaryTitle()}>
            함께 일한 알바생 대부분이 추천해요
          </text>
          <text
            {...styles.summaryDescription()}
          >{`최근 6개월 후기 ${props.reviews.length}개 기준`}</text>
        </view>
      </view>
      <view {...styles.chips()}>
        {highlights.map((highlight) => (
          <view key={highlight.label} {...styles.chip()}>
            <text {...styles.chipLabel()}>{highlight.label}</text>
            <text {...styles.chipCount()}>{String(highlight.count)}</text>
          </view>
        ))}
      </view>
      {props.reviews.length === 0 ? (
        <view {...styles.empty()}>
          <text {...styles.emptyText()}>아직 작성된 후기가 없어요.</text>
        </view>
      ) : (
        <view {...styles.list()}>
          {props.reviews.map((review, index) => (
            <view key={review.id}>
              {index > 0 && <view {...styles.separator()} />}
              <ApplicantReviewCard review={review} />
            </view>
          ))}
        </view>
      )}
    </view>
  )
}

export declare namespace JobPostAuthorReview {
  type Props = {
    author: Author
    onMore(): void
    reviews: readonly Review[]
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const chip = style({
    ...row,
    backgroundColor: 'bg.layerDefault',
    border: `1px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '1000px',
    gap: '4px',
    height: '30px',
    padding: '0 10px',
  })

  export const chipCount = style({
    color: 'fg.neutralMuted',
    typography: 't3Bold',
  })

  export const chipLabel = style({
    color: 'fg.neutral',
    typography: 't3Regular',
  })

  export const chips = style({
    ...row,
    flexWrap: 'wrap',
    gap: '6px',
    padding: '16px 16px 4px',
  })

  export const count = style({
    color: 'fg.neutralSubtle',
    marginLeft: '4px',
    typography: 't6Bold',
  })

  export const empty = style({
    ...column,
    alignItems: 'center',
    gap: '8px',
    padding: '32px 16px',
  })

  export const emptyText = style({
    color: 'fg.neutralSubtle',
    typography: 't4Regular',
  })

  export const header = style({
    ...row,
    justifyContent: 'space-between',
    padding: '0 16px',
  })

  export const heading = style({ color: 'fg.neutral', typography: 't6Bold' })

  export const list = style({ ...column, padding: '0 16px' })

  export const more = style({ ...row, gap: '2px', minHeight: '32px' })

  export const moreLabel = style({
    color: 'fg.neutralSubtle',
    typography: 't4Regular',
  })

  export const root = style({ ...column, width: '100%' })

  export const separator = style({
    backgroundColor: 'stroke.neutralSubtle',
    height: '1px',
  })

  export const summary = style({
    ...row,
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '10px',
    gap: '12px',
    margin: '16px 16px 0',
    padding: '14px 16px',
  })

  export const summaryDescription = style({
    color: 'fg.neutralMuted',
    typography: 't3Regular',
  })

  export const summaryScore = style({
    color: 'fg.neutral',
    typography: 't7Bold',
  })

  export const summaryText = style({ ...column, flex: 1, gap: '2px' })

  export const summaryTitle = style({
    color: 'fg.neutral',
    typography: 't4Bold',
  })
}
