import { useState } from '@lynx-js/react'
import type { Author, JobPost } from '../../fixtures.js'
import * as styles from './JobPostHeader.css.js'

/** Image gallery with tap paging and indicators, followed by the title and meta line. */
export function JobPostHeader(props: JobPostHeader.Props) {
  const [index, setIndex] = useState(0)
  const images = props.post.images
  const current = images[index]
  const count = images.length

  function move(delta: number) {
    if (count === 0) return
    setIndex((index + delta + count) % count)
  }

  return (
    <view className={styles.root}>
      <view className={styles.gallery}>
        {current !== undefined && (
          <image
            className={styles.galleryImage}
            src={current}
            mode="aspectFill"
          />
        )}
        <view
          className={`${styles.galleryTapZone} ${styles.galleryPrev}`}
          bindtap={() => move(-1)}
        />
        <view
          className={`${styles.galleryTapZone} ${styles.galleryNext}`}
          bindtap={() => move(1)}
        />
        <view className={styles.indicators}>
          {images.map((image, i) => (
            <view
              key={image}
              className={`${styles.indicator} ${i === index ? styles.activeIndicator : ''}`}
            />
          ))}
        </view>
        <text className={styles.counter}>{`${index + 1} / ${count}`}</text>
      </view>
      <view className={styles.copy}>
        <view className={styles.badges}>
          <image className={styles.badgeImage} src={props.author.avatar} />
          <view className={styles.divider} />
          <view className={styles.staff}>
            <image className={styles.staffImage} src={props.author.avatar} />
            <view className={styles.shine}>
              <image className={styles.shineImage} src={props.author.avatar} />
            </view>
          </view>
        </view>
        <text
          className={`${styles.title} ${props.closed ? styles.closed : ''}`}
        >
          {props.post.title}
        </text>
        <view className={styles.metaContainer}>
          <image className={styles.companyLogo} src={props.author.avatar} />
          <text className={`${styles.meta} ${styles.metaWithCompanyLogo}`}>
            {props.post.companyName}
            {' · '}
            <text
              className={styles.review}
            >{`후기 ${props.author.reviewCount}`}</text>
            {' · '}
            {props.post.publishedAt}
            {'  '}
            <text className={styles.ai}>AI 요약</text>
          </text>
        </view>
      </view>
    </view>
  )
}

export declare namespace JobPostHeader {
  type Props = {
    author: Author
    closed?: boolean
    post: JobPost
  }
}
