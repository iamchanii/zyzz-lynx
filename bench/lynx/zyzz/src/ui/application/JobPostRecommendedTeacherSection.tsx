import { useState } from '@lynx-js/react'
import { style, vars } from '../../zyzz.config.js'
import type { Teacher } from '../../fixtures.js'
import { InterestHeart } from '../general/InterestHeart.js'

/** Horizontally scrolling teacher cards with ratings, tags, and watch hearts. */
export function JobPostRecommendedTeacherSection(
  props: JobPostRecommendedTeacherSection.Props,
) {
  const [watched, setWatched] = useState<readonly string[]>([])

  return (
    <view {...styles.root()}>
      <text {...styles.heading()}>이 알바와 어울리는 선생님</text>
      <text {...styles.subheading()}>자격증과 실무를 함께 준비해 보세요</text>
      <scroll-view {...styles.scroll()} scroll-orientation="horizontal">
        <view {...styles.track()}>
          {props.teachers.map((teacher) => {
            const active = watched.includes(teacher.id)
            return (
              <view
                key={teacher.id}
                {...styles.card()}
                bindtap={() => props.onOpenTeacher(teacher.id)}
              >
                <view {...styles.photo()}>
                  <image
                    {...styles.image()}
                    src={teacher.photo}
                    mode="aspectFill"
                  />
                  <view {...styles.rating()}>
                    <view {...styles.ratingStar()} />
                    <text {...styles.ratingText()}>{teacher.rating}</text>
                  </view>
                </view>
                <view {...styles.body()}>
                  <text {...styles.name()}>{teacher.name}</text>
                  <text {...styles.subject()}>{teacher.subject}</text>
                  <text
                    {...styles.lessons()}
                  >{`수업 ${teacher.lessonCount}회`}</text>
                  <view {...styles.tags()}>
                    {teacher.tags.map((tag) => (
                      <view key={tag} {...styles.tag()}>
                        <text {...styles.tagLabel()}>{tag}</text>
                      </view>
                    ))}
                  </view>
                </view>
                <view {...styles.watch()}>
                  <text {...styles.watchLabel()}>
                    {active ? '관심 선생님' : '관심 등록'}
                  </text>
                  <InterestHeart
                    active={active}
                    onActiveChange={(next) =>
                      setWatched(
                        next
                          ? [...watched, teacher.id]
                          : watched.filter((id) => id !== teacher.id),
                      )
                    }
                  />
                </view>
              </view>
            )
          })}
        </view>
      </scroll-view>
      <view {...styles.more()}>
        <view {...styles.moreButton()} bindtap={props.onMore}>
          <text {...styles.moreLabel()}>선생님 더보기</text>
        </view>
      </view>
    </view>
  )
}

export declare namespace JobPostRecommendedTeacherSection {
  type Props = {
    onMore(): void
    onOpenTeacher(id: string): void
    teachers: readonly Teacher[]
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const body = style({ ...column, gap: '4px', padding: '12px' })

  export const card = style({
    ...column,
    border: `1px solid ${vars.color.stroke.neutralSubtle}`,
    borderRadius: '12px',
    flexShrink: 0,
    overflow: 'hidden',
    width: '200rpx',
    ':active': { backgroundColor: 'bg.neutralWeak' },
  })

  export const heading = style({
    color: 'fg.neutral',
    margin: '0 16px',
    typography: 't6Bold',
  })

  export const image = style({ height: '100%', width: '100%' })

  export const lessons = style({
    color: 'fg.neutralSubtle',
    typography: 't2Regular',
  })

  export const more = style({ padding: '8px 16px 28px' })

  export const moreButton = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '6px',
    height: '40px',
    justifyContent: 'center',
  })

  export const moreLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })

  export const name = style({
    color: 'fg.neutral',
    textOverflow: 'ellipsis',
    typography: 't4Bold',
    whiteSpace: 'nowrap',
  })

  export const photo = style({
    backgroundColor: 'bg.neutralMuted',
    height: '112px',
    position: 'relative',
    width: '100%',
  })

  export const rating = style({
    ...row,
    backgroundColor: 'palette.staticBlackAlpha500',
    borderRadius: '10px',
    bottom: '8px',
    gap: '2px',
    left: '8px',
    padding: '2px 6px',
    position: 'absolute',
  })

  export const ratingStar = style({
    backgroundColor: 'palette.carrot500',
    borderRadius: '5px',
    height: '10px',
    width: '10px',
  })

  export const ratingText = style({
    color: 'fg.staticWhite',
    typography: 't2Bold',
  })

  export const root = style({
    ...column,
    backgroundColor: 'bg.layerDefault',
    paddingTop: '28px',
    width: '100%',
  })

  export const scroll = style({ marginTop: '16px', width: '100%' })

  export const subheading = style({
    color: 'fg.neutralSubtle',
    margin: '4px 16px 0',
    typography: 't4Regular',
  })

  export const subject = style({
    color: 'fg.neutralMuted',
    typography: 't3Regular',
  })

  export const tag = style({
    backgroundColor: 'bg.brandWeak',
    borderRadius: '4px',
    padding: '2px 6px',
  })

  export const tagLabel = style({
    color: 'fg.brand',
    fontWeight: 700,
    typography: 't1Regular',
  })

  export const tags = style({
    ...row,
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '4px',
  })

  export const track = style({
    ...row,
    alignItems: 'stretch',
    gap: '12px',
    padding: '0 16px',
  })

  export const watch = style({
    ...row,
    justifyContent: 'space-between',
    padding: '0 12px 12px',
  })

  export const watchLabel = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })
}
