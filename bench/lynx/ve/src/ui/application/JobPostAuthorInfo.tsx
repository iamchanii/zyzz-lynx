import type { Author, NeighborhoodJob } from '../../fixtures.js'
import { AuthorCertificationsCallout } from './AuthorCertificationsCallout.js'
import * as styles from './JobPostAuthorInfo.css.js'

/** Author profile with temperature, hiring stats, badges, certifications, and other posts. */
export function JobPostAuthorInfo(props: JobPostAuthorInfo.Props) {
  const author = props.author

  return (
    <view className={styles.root}>
      <text className={styles.heading}>사장님 정보</text>
      <view className={styles.profile}>
        <view className={styles.avatar}>
          <image className={styles.avatarImage} src={author.avatar} />
        </view>
        <view className={styles.identity}>
          <view className={styles.nicknameRow}>
            <text className={styles.nickname}>{author.nickname}</text>
            <view className={styles.verified} />
          </view>
          <text
            className={styles.summary}
          >{`응답률 ${author.responseRate} · 후기 ${author.reviewCount}개`}</text>
        </view>
        <view className={styles.temperature}>
          <text className={styles.temperatureValue}>{author.temperature}</text>
          <view className={styles.temperatureTrack}>
            <view className={styles.temperatureRange} />
          </view>
        </view>
      </view>
      <view className={styles.stats}>
        <view className={styles.stat}>
          <text className={styles.statValue}>{String(author.hireCount)}</text>
          <text className={styles.statLabel}>채용 횟수</text>
        </view>
        <view className={styles.statSeparator} />
        <view className={styles.stat}>
          <text className={styles.statValue}>{author.responseRate}</text>
          <text className={styles.statLabel}>응답률</text>
        </view>
        <view className={styles.statSeparator} />
        <view className={styles.stat}>
          <text className={styles.statValue}>{String(author.reviewCount)}</text>
          <text className={styles.statLabel}>받은 후기</text>
        </view>
      </view>
      <view className={styles.badges}>
        {author.badges.map((badge) => (
          <view key={badge} className={styles.badge}>
            <view className={styles.badgeIcon} />
            <text className={styles.badgeLabel}>{badge}</text>
          </view>
        ))}
      </view>
      <AuthorCertificationsCallout certifications={author.certifications} />
      <view className={styles.actions}>
        <view className={styles.action} bindtap={props.onFollow}>
          <text className={styles.actionLabel}>사장님 팔로우</text>
        </view>
        <view className={styles.action} bindtap={props.onReport}>
          <text className={styles.actionLabel}>신고하기</text>
        </view>
      </view>
      <view className={styles.otherPosts}>
        <text className={styles.otherPostsTitle}>사장님의 다른 공고</text>
        {props.otherPosts.map((post, index) => (
          <view key={post.id}>
            {index > 0 && <view className={styles.separator} />}
            <view className={styles.otherPost}>
              <image
                className={styles.otherPostThumbnail}
                src={post.thumbnail}
              />
              <view className={styles.otherPostText}>
                <text className={styles.otherPostTitle}>{post.title}</text>
                <text
                  className={styles.otherPostMeta}
                >{`${post.pay} · ${post.workDays}`}</text>
              </view>
            </view>
          </view>
        ))}
      </view>
    </view>
  )
}

export declare namespace JobPostAuthorInfo {
  type Props = {
    author: Author
    onFollow(): void
    onReport(): void
    otherPosts: readonly NeighborhoodJob[]
  }
}
