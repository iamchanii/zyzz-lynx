import { useState } from '@lynx-js/react'
import {
  dayLabels,
  weekOrder,
  type Benefit,
  type JobPost,
} from '../../fixtures.js'
import { ExpandableText } from '../general/ExpandableText.js'
import * as styles from './JobPostDetails.css.js'

const circleByKind: Record<Benefit['kind'], string> = {
  compensation: styles.compensationCircle,
  other: styles.otherCircle,
  support: styles.supportCircle,
}

/** Work conditions, salary, body text, benefits, notices, and the expandable calendar. */
export function JobPostDetails(props: JobPostDetails.Props) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const post = props.post

  return (
    <view className={styles.root}>
      <view className={styles.info}>
        <view className={styles.infoRow}>
          <view className={styles.icon} />
          <view className={`${styles.rowContent} ${styles.noWrap}`}>
            <text
              className={styles.salary}
            >{`${post.salary.type} ${post.salary.amount}`}</text>
            <view className={styles.salaryAnnotations}>
              {post.salary.annotations.map((annotation, index) => (
                <text
                  key={annotation}
                  className={
                    index === 0 ? styles.annotation : styles.annotationDot
                  }
                >
                  {index === 0 ? annotation : `· ${annotation}`}
                </text>
              ))}
            </view>
          </view>
        </view>
        <view className={styles.infoRow}>
          <view className={styles.icon} />
          <view className={styles.rowContent}>
            <text
              className={
                post.isOfficialEvent
                  ? styles.officialEventText
                  : styles.infoText
              }
            >
              {post.workPeriod}
            </text>
            <text className={`${styles.infoText} ${styles.muted}`}>
              {post.workTime}
            </text>
          </view>
        </view>
        <view className={`${styles.infoRow} ${styles.topRow}`}>
          <view className={`${styles.icon} ${styles.topIcon}`} />
          <view className={styles.rowContent}>
            <view className={styles.workDays}>
              {weekOrder.map((day) => {
                const on = post.workDays.includes(day)
                return (
                  <view
                    key={day}
                    className={`${styles.workDay} ${on ? styles.workDayOn : ''}`}
                  >
                    <text
                      className={`${styles.workDayLabel} ${on ? styles.workDayLabelOn : ''}`}
                    >
                      {dayLabels[day]}
                    </text>
                  </view>
                )
              })}
            </view>
            <view
              className={styles.calendarToggle}
              bindtap={() => setCalendarOpen(!calendarOpen)}
            >
              <text className={styles.small}>
                {calendarOpen ? '달력 접기' : '달력 보기'}
              </text>
              <view className={`${styles.icon} ${styles.smallIcon}`} />
            </view>
          </view>
        </view>
        <view className={`${styles.infoRow} ${styles.topRow}`}>
          <view className={`${styles.icon} ${styles.topIcon}`} />
          <view className={styles.rowContent}>
            <text className={styles.infoText}>{post.address}</text>
          </view>
        </view>
      </view>
      {calendarOpen && <Calendar weeks={post.calendar} />}
      <view className={styles.body}>
        <ExpandableText text={post.body} />
      </view>
      <view className={styles.tags}>
        {post.tags.map((tag) => (
          <view key={tag} className={styles.tag}>
            <text className={styles.tagLabel}>{tag}</text>
          </view>
        ))}
      </view>
      <text className={styles.counts}>
        {`관심 ${post.watchCount} · 조회 ${post.viewCount} · 지원 ${post.applicantCount}`}
      </text>
      <view className={styles.card}>
        {post.benefits.map((benefit, index) => (
          <view key={benefit.kind}>
            {index > 0 && <view className={styles.cardSeparator} />}
            <view className={styles.cardRow}>
              <view
                className={`${styles.circle} ${circleByKind[benefit.kind]}`}
              >
                <view className={styles.circleGlyph} />
              </view>
              <view className={styles.cardText}>
                <text className={styles.cardTitle}>{benefit.title}</text>
                <text className={styles.cardDescription}>
                  {benefit.description}
                </text>
              </view>
            </view>
          </view>
        ))}
      </view>
      <view className={styles.notice}>
        {post.notices.map((notice) => (
          <view key={notice} className={styles.noticeEntry}>
            <view className={styles.icon} />
            <text className={styles.noticeText}>{notice}</text>
          </view>
        ))}
      </view>
      <view className={styles.applicants}>
        <text className={styles.applicantsTitle}>
          {`지금 ${post.applicantCount}명이 지원했어요`}
        </text>
        <text className={styles.applicantsDescription}>
          <text className={styles.bold}>평균 2시간</text> 안에 사장님이 답장해요
        </text>
      </view>
    </view>
  )
}

export declare namespace JobPostDetails {
  type Props = {
    post: JobPost
  }
}

function Calendar(props: Calendar.Props) {
  return (
    <view className={styles.calendar}>
      <view className={styles.weekdays}>
        {weekOrder.map((day) => (
          <text
            key={day}
            className={`${styles.weekday} ${styles.weekdayTone[day]}`}
          >
            {dayLabels[day]}
          </text>
        ))}
      </view>
      {props.weeks.map((week, weekIndex) => (
        <view key={weekIndex} className={styles.week}>
          {week.map((day, dayIndex) => {
            const edge =
              dayIndex === 0
                ? styles.weekStart
                : dayIndex === 6
                  ? styles.weekEnd
                  : ''
            const fill = day.selected
              ? day.past
                ? styles.pastSelectedDay
                : styles.selectedDay
              : ''
            const number = day.selected
              ? styles.selectedDayNumber
              : day.past
                ? styles.pastDayNumber
                : day.holiday
                  ? styles.holidayNumber
                  : ''
            return (
              <view key={day.day} className={styles.day}>
                <view
                  className={`${styles.calendarCell} ${styles.calendarSegments[day.segment]} ${day.segment === 'middle' ? edge : ''} ${fill}`}
                >
                  <text className={`${styles.dayNumber} ${number}`}>
                    {String(day.day)}
                  </text>
                </view>
              </view>
            )
          })}
        </view>
      ))}
      <text className={styles.footnote}>공휴일은 근무일에서 제외돼요.</text>
    </view>
  )
}

declare namespace Calendar {
  type Props = {
    weeks: JobPost['calendar']
  }
}
