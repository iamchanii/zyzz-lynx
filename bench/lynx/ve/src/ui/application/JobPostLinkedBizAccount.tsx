import { useState } from '@lynx-js/react'
import type { LinkedBizAccount } from '../../fixtures.js'
import * as styles from './JobPostLinkedBizAccount.css.js'

/** Linked business profile row with a follow toggle. */
export function JobPostLinkedBizAccount(props: JobPostLinkedBizAccount.Props) {
  const [following, setFollowing] = useState(false)
  const account = props.account

  return (
    <view className={styles.root}>
      <view className={styles.logo}>
        <image className={styles.logoImage} src={account.logo} />
      </view>
      <view className={styles.text}>
        <view className={styles.nameRow}>
          <text className={styles.name}>{account.name}</text>
          <view className={styles.bizMark} />
        </view>
        <text
          className={styles.followers}
        >{`단골 ${account.followerCount.toLocaleString()}명`}</text>
        <text className={styles.description}>{account.description}</text>
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
          {following ? '단골' : '단골 맺기'}
        </text>
      </view>
    </view>
  )
}

export declare namespace JobPostLinkedBizAccount {
  type Props = {
    account: LinkedBizAccount
  }
}
