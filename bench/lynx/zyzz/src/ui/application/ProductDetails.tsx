import { useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { style, variants, vars } from '../../zyzz.config.js'
import { dayLabels, weekOrder, type Product } from '../../fixtures.js'
import { ExpandableText } from '../general/ExpandableText.js'

/** Price, shipping, body text, benefits, notices, and the expandable pickup calendar. */
export function ProductDetails(props: ProductDetails.Props) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const product = props.product

  return (
    <view {...styles.root()}>
      <view {...styles.info()}>
        <view {...styles.infoRow()}>
          <view {...styles.icon()} />
          <view {...cx(styles.rowContent(), styles.noWrap())}>
            <text
              {...styles.price()}
            >{`${product.price.type} ${product.price.amount}`}</text>
            <view {...styles.priceAnnotations()}>
              {product.price.annotations.map((annotation, index) => (
                <text
                  key={annotation}
                  {...cx(
                    index === 0 && styles.annotation(),
                    index !== 0 && styles.annotationDot(),
                  )}
                >
                  {index === 0 ? annotation : `· ${annotation}`}
                </text>
              ))}
            </view>
          </view>
        </view>
        <view {...styles.infoRow()}>
          <view {...styles.icon()} />
          <view {...styles.rowContent()}>
            <text
              {...cx(
                product.isEvent && styles.eventText(),
                !product.isEvent && styles.infoText(),
              )}
            >
              {product.shipping}
            </text>
            <text {...cx(styles.infoText(), styles.muted())}>
              {product.shippingNote}
            </text>
          </view>
        </view>
        <view {...cx(styles.infoRow(), styles.topRow())}>
          <view {...cx(styles.icon(), styles.topIcon())} />
          <view {...styles.rowContent()}>
            <view {...styles.pickupDays()}>
              {weekOrder.map((day) => {
                const on = product.pickupDays.includes(day)
                return (
                  <view
                    key={day}
                    {...cx(styles.pickupDay(), on && styles.pickupDayOn())}
                  >
                    <text
                      {...cx(
                        styles.pickupDayLabel(),
                        on && styles.pickupDayLabelOn(),
                      )}
                    >
                      {dayLabels[day]}
                    </text>
                  </view>
                )
              })}
            </view>
            <view
              {...styles.calendarToggle()}
              bindtap={() => setCalendarOpen(!calendarOpen)}
            >
              <text {...styles.small()}>
                {calendarOpen ? '달력 접기' : '달력 보기'}
              </text>
              <view {...cx(styles.icon(), styles.smallIcon())} />
            </view>
          </view>
        </view>
        <view {...cx(styles.infoRow(), styles.topRow())}>
          <view {...cx(styles.icon(), styles.topIcon())} />
          <view {...styles.rowContent()}>
            <text {...styles.infoText()}>{product.address}</text>
          </view>
        </view>
      </view>
      {calendarOpen && <Calendar weeks={product.calendar} />}
      <view {...styles.body()}>
        <ExpandableText text={product.body} />
      </view>
      <view {...styles.tags()}>
        {product.tags.map((tag) => (
          <view key={tag} {...styles.tag()}>
            <text {...styles.tagLabel()}>{tag}</text>
          </view>
        ))}
      </view>
      <text {...styles.counts()}>
        {`관심 ${product.watchCount} · 조회 ${product.viewCount} · 구매 ${product.orderCount}`}
      </text>
      <view {...styles.card()}>
        {product.benefits.map((benefit, index) => (
          <view key={benefit.kind}>
            {index > 0 && <view {...styles.cardSeparator()} />}
            <view {...styles.cardRow()}>
              <view className={styles.circle({ kind: benefit.kind })}>
                <view {...styles.circleGlyph()} />
              </view>
              <view {...styles.cardText()}>
                <text {...styles.cardTitle()}>{benefit.title}</text>
                <text {...styles.cardDescription()}>{benefit.description}</text>
              </view>
            </view>
          </view>
        ))}
      </view>
      <view {...styles.notice()}>
        {product.notices.map((notice) => (
          <view key={notice} {...styles.noticeEntry()}>
            <view {...styles.icon()} />
            <text {...styles.noticeText()}>{notice}</text>
          </view>
        ))}
      </view>
      <view {...styles.orders()}>
        <text {...styles.ordersTitle()}>
          {`지금 ${product.orderCount}명이 구매했어요`}
        </text>
        <text {...styles.ordersDescription()}>
          <text {...styles.bold()}>평균 2시간</text> 안에 판매자가 답장해요
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
    <view {...styles.calendar()}>
      <view {...styles.weekdays()}>
        {weekOrder.map((day) => (
          <text key={day} className={styles.weekday({ tone: day })}>
            {dayLabels[day]}
          </text>
        ))}
      </view>
      {props.weeks.map((week, weekIndex) => (
        <view key={weekIndex} {...styles.week()}>
          {week.map((day, dayIndex) => {
            const middle = day.segment === 'middle'
            return (
              <view key={day.day} {...styles.day()}>
                <view
                  {...cx(
                    styles.calendarCell({ segment: day.segment }),
                    middle && dayIndex === 0 && styles.weekStart(),
                    middle && dayIndex === 6 && styles.weekEnd(),
                    day.selected && day.past && styles.pastSelectedDay(),
                    day.selected && !day.past && styles.selectedDay(),
                  )}
                >
                  <text
                    {...cx(
                      styles.dayNumber(),
                      day.selected && styles.selectedDayNumber(),
                      !day.selected && day.past && styles.pastDayNumber(),
                      !day.selected &&
                        !day.past &&
                        day.holiday &&
                        styles.holidayNumber(),
                    )}
                  >
                    {String(day.day)}
                  </text>
                </view>
              </view>
            )
          })}
        </view>
      ))}
      <text {...styles.footnote()}>공휴일은 픽업 요일에서 제외돼요.</text>
    </view>
  )
}

declare namespace Calendar {
  type Props = {
    weeks: Product['calendar']
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const regular = {
  color: 'fg.neutral',
  fontSize: '16px',
  lineHeight: '22px',
} as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const annotation = style({
    color: 'fg.positive',
    flexShrink: 1,
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: regular.lineHeight,
    whiteSpace: 'normal',
  })

  export const annotationDot = style([
    annotation,
    {
      flexShrink: 0,
      fontSize: '13px',
      lineHeight: '18px',
      paddingBottom: '1px',
    },
  ])

  export const orders = style({
    ...column,
    borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
    gap: '4px',
    marginTop: '16px',
    paddingBottom: '20px',
    paddingTop: '20px',
  })

  export const ordersDescription = style({
    color: 'fg.neutralMuted',
    typography: 't4Regular',
  })

  export const ordersTitle = style({
    color: 'fg.neutral',
    typography: 't5Bold',
  })

  export const body = style({ marginTop: '24px' })

  export const bold = style({ fontWeight: 700 })

  export const calendar = style({
    ...column,
    backgroundColor: 'bg.layerDefault',
    // Body padding is 16px, and the calendar extends across it on both sides.
    marginLeft: '-16px',
    marginRight: '-16px',
    marginTop: '8px',
    padding: '12px 6px 6px',
  })

  // Class selection, so the cell combines with the edge and fill styles through cx.
  export const calendarCell = variants({
    base: {
      ...row,
      bottom: '4px',
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      right: 0,
      top: '4px',
    },
    variants: {
      segment: {
        end: {
          borderBottomRightRadius: '999px',
          borderTopRightRadius: '999px',
          paddingLeft: '4px',
          right: '4px',
        },
        middle: {},
        none: { left: '4px', right: '4px' },
        single: { borderRadius: '50%', left: '4px', right: '4px' },
        start: {
          borderBottomLeftRadius: '999px',
          borderTopLeftRadius: '999px',
          left: '4px',
          paddingRight: '4px',
        },
      },
    },
  })

  export const calendarToggle = style({ ...row, gap: '2px' })

  export const card = style({
    ...column,
    border: `1px solid ${vars.color.stroke.neutralSubtle}`,
    borderRadius: '12px',
    marginBottom: '16px',
    marginTop: '20px',
    padding: '20px 16px',
  })

  export const cardRow = style({ ...row, gap: '20px' })

  export const cardText = style({ ...column, flex: 1, gap: '4px' })

  export const circle = variants({
    base: {
      ...row,
      borderRadius: '22px',
      flexShrink: 0,
      height: '44px',
      justifyContent: 'center',
      width: '44px',
    },
    selection: 'className',
    variants: {
      kind: {
        reward: { backgroundColor: 'bg.informativeWeak' },
        other: { backgroundColor: 'bg.neutralWeak' },
        shipping: { backgroundColor: 'palette.purple100' },
      },
    },
  })

  export const circleGlyph = style({
    backgroundColor: 'fg.neutralMuted',
    borderRadius: '10px',
    height: '20px',
    width: '20px',
  })

  export const counts = style({
    color: 'fg.neutralSubtle',
    marginTop: '20px',
    typography: 't3Regular',
  })

  export const countsAfterSection = style({ marginTop: 0 })

  export const day = style({
    aspectRatio: '1',
    position: 'relative',
    width: '14.285714285714286%',
  })

  export const dayNumber = style({
    color: 'fg.neutral',
    typography: 't5Regular',
    whiteSpace: 'nowrap',
  })

  export const error = style({
    backgroundColor: 'bg.criticalWeak',
    borderRadius: '8px',
    color: 'fg.critical',
    padding: '10px 12px',
    typography: 't3Regular',
    whiteSpace: 'normal',
  })

  export const footnote = style({
    color: 'fg.neutralSubtle',
    marginTop: '10px',
    typography: 't3Regular',
    whiteSpace: 'normal',
  })

  export const holidayNumber = style({ color: 'palette.carrot600' })

  export const icon = style({
    backgroundColor: 'fg.neutralSubtle',
    borderRadius: '4px',
    flexShrink: 0,
    height: '16px',
    width: '16px',
  })

  export const info = style({ ...column, gap: '12px' })

  export const infoRow = style({ ...row, gap: '8px', minHeight: '22px' })

  export const infoText = style({
    ...regular,
    fontWeight: 500,
    whiteSpace: 'normal',
  })

  export const muted = style({ color: 'fg.neutralSubtle' })

  export const notice = style({ ...column, gap: '8px', marginTop: '20px' })

  export const noticeEntry = style({
    ...row,
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '10px',
    boxSizing: 'border-box',
    gap: '12px',
    minHeight: '50px',
    padding: '14px',
  })

  export const noticeText = style({
    color: 'fg.neutral',
    flex: 1,
    typography: 't4Regular',
    whiteSpace: 'normal',
  })

  export const noWrap = style({ flexWrap: 'nowrap' })

  export const eventText = style([
    infoText,
    { color: 'palette.carrot800', fontWeight: 400 },
  ])

  export const pastDayNumber = style({ color: 'palette.gray500' })

  export const pastSelectedDay = style({ backgroundColor: 'palette.gray200' })

  export const root = style({
    ...column,
    boxSizing: 'border-box',
    width: '100%',
  })

  export const rowContent = style({
    ...row,
    flex: 1,
    flexWrap: 'wrap',
    gap: '6px',
    minWidth: 0,
  })

  export const price = style({
    ...regular,
    flexShrink: 0,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  })

  export const priceAnnotations = style({
    ...row,
    flex: 1,
    gap: '2px',
    minWidth: 0,
  })

  export const selectedDay = style({ backgroundColor: 'palette.gray900' })

  export const selectedDayNumber = style({ color: 'palette.gray00' })

  export const separator = style({
    backgroundColor: 'stroke.neutralMuted',
    height: '1px',
  })

  export const cardSeparator = style([
    separator,
    {
      marginBottom: '16px',
      marginLeft: '8px',
      marginRight: '8px',
      marginTop: '16px',
    },
  ])

  export const small = style({
    color: 'fg.neutralSubtle',
    typography: 't4Regular',
  })

  export const smallIcon = style({
    height: '14px',
    marginTop: '3px',
    width: '14px',
  })

  export const subtitle = style({
    color: 'fg.neutral',
    typography: 't4Regular',
    whiteSpace: 'normal',
  })

  export const cardDescription = style([subtitle, { fontWeight: 500 }])

  export const cardTitle = style([subtitle, { color: 'fg.neutralMuted' }])

  export const tag = style({
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '4px',
    padding: '4px 8px',
  })

  export const tagLabel = style({
    color: 'fg.neutralMuted',
    typography: 't3Regular',
  })

  export const tags = style({
    ...row,
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '16px',
  })

  export const topIcon = style({ marginTop: '2px' })

  export const topRow = style({ alignItems: 'flex-start' })

  export const week = style({ ...row })

  export const weekday = variants({
    base: {
      textAlign: 'center',
      typography: 't3Regular',
      width: '14.285714285714286%',
    },
    selection: 'className',
    variants: {
      tone: {
        fri: { color: 'palette.gray700' },
        mon: { color: 'palette.gray700' },
        sat: { color: 'palette.blue900' },
        sun: { color: 'palette.carrot600' },
        thu: { color: 'palette.gray700' },
        tue: { color: 'palette.gray700' },
        wed: { color: 'palette.gray700' },
      },
    },
  })

  export const weekdays = style({ ...row, marginBottom: '4px' })

  export const weekEnd = style({ left: 0, right: '4px' })

  export const weekStart = style({ left: '4px', right: 0 })

  export const pickupDay = style({
    ...row,
    borderRadius: '11px',
    height: '22px',
    justifyContent: 'center',
    width: '22px',
  })

  export const pickupDayLabel = style({
    color: 'fg.neutralSubtle',
    typography: 't2Regular',
  })

  export const pickupDayLabelOn = style({
    color: 'palette.gray00',
    fontWeight: 700,
  })

  export const pickupDayOn = style({ backgroundColor: 'palette.gray900' })

  export const pickupDays = style({ ...row, gap: '4px' })
}
