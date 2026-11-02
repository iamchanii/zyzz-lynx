import { useState } from '@lynx-js/react'
import type { Teacher } from '../../fixtures.js'
import { InterestHeart } from '../general/InterestHeart.js'
import * as styles from './JobPostRecommendedTeacherSection.css.js'

/** Horizontally scrolling teacher cards with ratings, tags, and watch hearts. */
export function JobPostRecommendedTeacherSection(
  props: JobPostRecommendedTeacherSection.Props,
) {
  const [watched, setWatched] = useState<readonly string[]>([])

  return (
    <view className={styles.root}>
      <text className={styles.heading}>이 알바와 어울리는 선생님</text>
      <text className={styles.subheading}>
        자격증과 실무를 함께 준비해 보세요
      </text>
      <scroll-view className={styles.scroll} scroll-orientation="horizontal">
        <view className={styles.track}>
          {props.teachers.map((teacher) => {
            const active = watched.includes(teacher.id)
            return (
              <view
                key={teacher.id}
                className={styles.card}
                bindtap={() => props.onOpenTeacher(teacher.id)}
              >
                <view className={styles.photo}>
                  <image
                    className={styles.image}
                    src={teacher.photo}
                    mode="aspectFill"
                  />
                  <view className={styles.rating}>
                    <view className={styles.ratingStar} />
                    <text className={styles.ratingText}>{teacher.rating}</text>
                  </view>
                </view>
                <view className={styles.body}>
                  <text className={styles.name}>{teacher.name}</text>
                  <text className={styles.subject}>{teacher.subject}</text>
                  <text
                    className={styles.lessons}
                  >{`수업 ${teacher.lessonCount}회`}</text>
                  <view className={styles.tags}>
                    {teacher.tags.map((tag) => (
                      <view key={tag} className={styles.tag}>
                        <text className={styles.tagLabel}>{tag}</text>
                      </view>
                    ))}
                  </view>
                </view>
                <view className={styles.watch}>
                  <text className={styles.watchLabel}>
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
      <view className={styles.more}>
        <view className={styles.moreButton} bindtap={props.onMore}>
          <text className={styles.moreLabel}>선생님 더보기</text>
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
