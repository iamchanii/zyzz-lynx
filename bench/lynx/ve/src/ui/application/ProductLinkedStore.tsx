import { useState } from '@lynx-js/react'
import type { LinkedStore } from '../../fixtures.js'
import * as styles from './ProductLinkedStore.css.js'

/** Linked store profile row with a follow toggle. */
export function ProductLinkedStore(props: ProductLinkedStore.Props) {
  const [following, setFollowing] = useState(false)
  const store = props.store

  return (
    <view className={styles.root}>
      <view className={styles.logo}>
        <image className={styles.logoImage} src={store.logo} />
      </view>
      <view className={styles.text}>
        <view className={styles.nameRow}>
          <text className={styles.name}>{store.name}</text>
          <view className={styles.storeMark} />
        </view>
        <text
          className={styles.followers}
        >{`팔로워 ${store.followerCount.toLocaleString()}명`}</text>
        <text className={styles.description}>{store.description}</text>
      </view>
      <view
        className={`${styles.follow} ${following ? styles.following : ''}`}
        accessibility-element={true}
        accessibility-traits="button"
        bindtap={() => setFollowing(!following)}
      >
        <text
          className={`${styles.followLabel} ${following ? styles.followingLabel : ''}`}
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
