import { useState } from '@lynx-js/react'
import { cx } from 'zyzz'
import { style, vars } from '../../zyzz.config.js'
import type { LinkedStore } from '../../fixtures.js'

/** Linked store profile row with a follow toggle. */
export function ProductLinkedStore(props: ProductLinkedStore.Props) {
  const [following, setFollowing] = useState(false)
  const store = props.store

  return (
    <view {...styles.root()}>
      <view {...styles.logo()}>
        <image {...styles.logoImage()} src={store.logo} />
      </view>
      <view {...styles.text()}>
        <view {...styles.nameRow()}>
          <text {...styles.name()}>{store.name}</text>
          <view {...styles.storeMark()} />
        </view>
        <text
          {...styles.followers()}
        >{`팔로워 ${store.followerCount.toLocaleString()}명`}</text>
        <text {...styles.description()}>{store.description}</text>
      </view>
      <view
        {...cx(styles.follow(), following && styles.following())}
        accessibility-element={true}
        accessibility-traits="button"
        bindtap={() => setFollowing(!following)}
      >
        <text
          {...cx(styles.followLabel(), following && styles.followingLabel())}
        >
          {following ? '팔로잉' : '팔로우'}
        </text>
      </view>
    </view>
  )
}

export declare namespace ProductLinkedStore {
  type Props = {
    store: LinkedStore
  }
}

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const storeMark = style({
    backgroundColor: 'bg.brandSolid',
    borderRadius: '2px',
    flexShrink: 0,
    height: '12px',
    width: '12px',
  })

  export const description = style({
    color: 'fg.neutralMuted',
    textOverflow: 'ellipsis',
    typography: 't3Regular',
    whiteSpace: 'nowrap',
  })

  export const follow = style({
    ...row,
    backgroundColor: 'bg.brandSolid',
    borderRadius: '6px',
    flexShrink: 0,
    height: '32px',
    justifyContent: 'center',
    padding: '0 12px',
  })

  export const followers = style({
    color: 'fg.neutralSubtle',
    typography: 't2Regular',
  })

  export const following = style({
    backgroundColor: 'bg.layerDefault',
    border: `1px solid ${vars.color.stroke.brand}`,
  })

  export const followingLabel = style({ color: 'fg.brand' })

  export const followLabel = style({
    color: 'fg.staticWhite',
    typography: 't3Bold',
  })

  export const logo = style({
    backgroundColor: 'palette.gray200',
    border: `1px solid ${vars.color.stroke.neutralSubtle}`,
    borderRadius: '22px',
    flexShrink: 0,
    height: '44px',
    overflow: 'hidden',
    width: '44px',
  })

  export const logoImage = style({ height: '100%', width: '100%' })

  export const name = style({
    color: 'fg.neutral',
    flexShrink: 1,
    minWidth: 0,
    textOverflow: 'ellipsis',
    typography: 't4Bold',
    whiteSpace: 'nowrap',
  })

  export const nameRow = style({ ...row, gap: '4px' })

  export const root = style({ ...row, gap: '12px', padding: '20px 16px' })

  export const text = style({ ...column, flex: 1, gap: '2px', minWidth: 0 })
}
