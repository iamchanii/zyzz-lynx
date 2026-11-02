import { useState } from '@lynx-js/react'
import { style } from '../../zyzz.config.js'
import type { CurationPost, CurationTab } from '../../fixtures.js'
import { SelectableChip } from '../general/SelectableChip.js'

/** Tabbed curation list where selectable chips switch the visible posts. */
export function JobPostPersonalJobCurationSection(
  props: JobPostPersonalJobCurationSection.Props,
) {
  const [selected, setSelected] = useState(props.tabs[0]?.id ?? '')
  const posts = props.postsByTab[selected] ?? []

  return (
    <view {...styles.root()}>
      <text {...styles.heading()}>{`${props.viewerName}님을 위한 알바`}</text>
      <view {...styles.tabs()}>
        {props.tabs.map((tab) => (
          <SelectableChip
            key={tab.id}
            checked={tab.id === selected}
            label={tab.label}
            onSelect={() => setSelected(tab.id)}
          />
        ))}
      </view>
      <view {...styles.rows()}>
        {posts.map((post, index) => (
          <view key={post.id}>
            {index > 0 && <view {...styles.separator()} />}
            <view {...styles.post()} bindtap={() => props.onOpenPost(post.id)}>
              <text {...styles.postTitle()}>{post.title}</text>
              <view {...styles.postMetaRow()}>
                <text {...styles.postPay()}>{post.pay}</text>
                <text {...styles.postMeta()}>{post.meta}</text>
              </view>
            </view>
          </view>
        ))}
      </view>
      <view {...styles.more()}>
        <view {...styles.moreButton()} bindtap={props.onMore}>
          <text {...styles.moreLabel()}>알바 더보기</text>
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

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const heading = style({
    color: 'fg.neutral',
    padding: '8px 16px',
    typography: 't6Bold',
  })

  export const more = style({ padding: '8px 16px 24px' })

  export const moreButton = style({
    ...row,
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '6px',
    height: '40px',
    justifyContent: 'center',
  })

  export const moreLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })

  export const post = style({ ...column, gap: '4px', padding: '12px 0' })

  export const postMeta = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const postMetaRow = style({ ...row, gap: '6px' })

  export const postPay = style({ color: 'fg.neutral', typography: 't4Bold' })

  export const postTitle = style({
    color: 'fg.neutral',
    textOverflow: 'ellipsis',
    typography: 't5Medium',
    whiteSpace: 'nowrap',
  })

  export const root = style({ ...column, paddingTop: '16px', width: '100%' })

  export const rows = style({ ...column, padding: '12px 16px' })

  export const separator = style({
    backgroundColor: 'stroke.neutralSubtle',
    height: '1px',
  })

  export const tabs = style({
    ...row,
    gap: '6px',
    height: '56px',
    padding: '8px 16px 12px',
  })
}
