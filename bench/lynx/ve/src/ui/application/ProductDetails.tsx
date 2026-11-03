import { useState } from '@lynx-js/react'
import {
  dayLabels,
  weekOrder,
  type Benefit,
  type Product,
} from '../../fixtures.js'
import { ExpandableText } from '../general/ExpandableText.js'
import * as styles from './ProductDetails.css.js'

const circleByKind: Record<Benefit['kind'], string> = {
  reward: styles.rewardCircle,
  other: styles.otherCircle,
  shipping: styles.shippingCircle,
}

/** Price, shipping, body text, benefits, notices, and the expandable pickup calendar. */
export function ProductDetails(props: ProductDetails.Props) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const product = props.product

  return (
    <view className={styles.root}>
      <view className={styles.info}>
        <view className={styles.infoRow}>
          <view className={styles.icon} />
          <view className={`${styles.rowContent} ${styles.noWrap}`}>
            <text
              className={styles.price}
            >{`${product.price.type} ${product.price.amount}`}</text>
            <view className={styles.priceAnnotations}>
              {product.price.annotations.map((annotation, index) => (
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
              className={product.isEvent ? styles.eventText : styles.infoText}
            >
              {product.shipping}
            </text>
            <text className={`${styles.infoText} ${styles.muted}`}>
              {product.shippingNote}
            </text>
          </view>
        </view>
        <view className={`${styles.infoRow} ${styles.topRow}`}>
          <view className={`${styles.icon} ${styles.topIcon}`} />
          <view className={styles.rowContent}>
            <view className={styles.pickupDays}>
              {weekOrder.map((day) => {
                const on = product.pickupDays.includes(day)
                return (
                  <view
                    key={day}
                    className={`${styles.pickupDay} ${on ? styles.pickupDayOn : ''}`}
                  >
                    <text
                      className={`${styles.pickupDayLabel} ${on ? styles.pickupDayLabelOn : ''}`}
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
            <text className={styles.infoText}>{product.address}</text>
          </view>
        </view>
      </view>
      {calendarOpen && <Calendar weeks={product.calendar} />}
      <view className={styles.body}>
        <ExpandableText text={product.body} />
      </view>
      <view className={styles.tags}>
        {product.tags.map((tag) => (
          <view key={tag} className={styles.tag}>
            <text className={styles.tagLabel}>{tag}</text>
          </view>
        ))}
      </view>
      <text className={styles.counts}>
        {`관심 ${product.watchCount} · 조회 ${product.viewCount} · 구매 ${product.orderCount}`}
      </text>
      <view className={styles.card}>
        {product.benefits.map((benefit, index) => (
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
        {product.notices.map((notice) => (
          <view key={notice} className={styles.noticeEntry}>
            <view className={styles.icon} />
            <text className={styles.noticeText}>{notice}</text>
          </view>
        ))}
      </view>
      <view className={styles.orders}>
        <text className={styles.ordersTitle}>
          {`지금 ${product.orderCount}명이 구매했어요`}
        </text>
        <text className={styles.ordersDescription}>
          <text className={styles.bold}>평균 2시간</text> 안에 판매자가 답장해요
        </text>
      </view>
    </view>
  )
}

export declare namespace ProductDetails {
  type Props = {
    product: Product
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
      <text className={styles.footnote}>공휴일은 픽업 요일에서 제외돼요.</text>
    </view>
  )
}

declare namespace Calendar {
  type Props = {
    weeks: Product['calendar']
  }
}
