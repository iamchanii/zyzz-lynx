import { useState } from '@lynx-js/react'
import type { CurationPost, CurationTab } from '../../fixtures.js'
import { SelectableChip } from '../general/SelectableChip.js'
import * as styles from './JobPostPersonalJobCurationSection.css.js'

/** Tabbed curation list where selectable chips switch the visible posts. */
export function JobPostPersonalJobCurationSection(
  props: JobPostPersonalJobCurationSection.Props,
) {
  const [selected, setSelected] = useState(props.tabs[0]?.id ?? '')
  const posts = props.postsByTab[selected] ?? []

  return (
    <view className={styles.root}>
      <text
        className={styles.heading}
      >{`${props.viewerName}님을 위한 알바`}</text>
      <view className={styles.tabs}>
        {props.tabs.map((tab) => (
          <SelectableChip
            key={tab.id}
            checked={tab.id === selected}
            label={tab.label}
            onSelect={() => setSelected(tab.id)}
          />
        ))}
      </view>
      <view className={styles.rows}>
        {posts.map((post, index) => (
          <view key={post.id}>
            {index > 0 && <view className={styles.separator} />}
            <view
              className={styles.post}
              bindtap={() => props.onOpenPost(post.id)}
            >
              <text className={styles.postTitle}>{post.title}</text>
              <view className={styles.postMetaRow}>
                <text className={styles.postPay}>{post.pay}</text>
                <text className={styles.postMeta}>{post.meta}</text>
              </view>
            </view>
          </view>
        ))}
      </view>
      <view className={styles.more}>
        <view className={styles.moreButton} bindtap={props.onMore}>
          <text className={styles.moreLabel}>알바 더보기</text>
        </view>
      </view>
    </view>
  )
}

export declare namespace JobPostPersonalJobCurationSection {
  type Props = {
    onMore(): void
    onOpenPost(id: string): void
    postsByTab: Readonly<Record<string, readonly CurationPost[]>>
    tabs: readonly CurationTab[]
    viewerName: string
  }
}
