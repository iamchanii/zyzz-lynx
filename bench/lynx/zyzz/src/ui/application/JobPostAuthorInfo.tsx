import { style, vars } from '../../zyzz.config.js'
import type { Author, NeighborhoodJob } from '../../fixtures.js'
import { AuthorCertificationsCallout } from './AuthorCertificationsCallout.js'

/** Author profile with temperature, hiring stats, badges, certifications, and other posts. */
export function JobPostAuthorInfo(props: JobPostAuthorInfo.Props) {
  const author = props.author

  return (
    <view {...styles.root()}>
      <text {...styles.heading()}>사장님 정보</text>
      <view {...styles.profile()}>
        <view {...styles.avatar()}>
          <image {...styles.avatarImage()} src={author.avatar} />
        </view>
        <view {...styles.identity()}>
          <view {...styles.nicknameRow()}>
            <text {...styles.nickname()}>{author.nickname}</text>
            <view {...styles.verified()} />
          </view>
          <text
            {...styles.summary()}
          >{`응답률 ${author.responseRate} · 후기 ${author.reviewCount}개`}</text>
        </view>
        <view {...styles.temperature()}>
          <text {...styles.temperatureValue()}>{author.temperature}</text>
          <view {...styles.temperatureTrack()}>
            <view {...styles.temperatureRange()} />
          </view>
        </view>
      </view>
      <view {...styles.stats()}>
        <view {...styles.stat()}>
          <text {...styles.statValue()}>{String(author.hireCount)}</text>
          <text {...styles.statLabel()}>채용 횟수</text>
        </view>
        <view {...styles.statSeparator()} />
        <view {...styles.stat()}>
          <text {...styles.statValue()}>{author.responseRate}</text>
          <text {...styles.statLabel()}>응답률</text>
        </view>
        <view {...styles.statSeparator()} />
        <view {...styles.stat()}>
          <text {...styles.statValue()}>{String(author.reviewCount)}</text>
          <text {...styles.statLabel()}>받은 후기</text>
        </view>
      </view>
      <view {...styles.badges()}>
        {author.badges.map((badge) => (
          <view key={badge} {...styles.badge()}>
            <view {...styles.badgeIcon()} />
            <text {...styles.badgeLabel()}>{badge}</text>
          </view>
        ))}
      </view>
      <AuthorCertificationsCallout certifications={author.certifications} />
      <view {...styles.actions()}>
        <view {...styles.action()} bindtap={props.onFollow}>
          <text {...styles.actionLabel()}>사장님 팔로우</text>
        </view>
        <view {...styles.action()} bindtap={props.onReport}>
          <text {...styles.actionLabel()}>신고하기</text>
        </view>
      </view>
      <view {...styles.otherPosts()}>
        <text {...styles.otherPostsTitle()}>사장님의 다른 공고</text>
        {props.otherPosts.map((post, index) => (
          <view key={post.id}>
            {index > 0 && <view {...styles.separator()} />}
            <view {...styles.otherPost()}>
              <image {...styles.otherPostThumbnail()} src={post.thumbnail} />
              <view {...styles.otherPostText()}>
                <text {...styles.otherPostTitle()}>{post.title}</text>
                <text
                  {...styles.otherPostMeta()}
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

const column = { display: 'flex', flexDirection: 'column' } as const

const row = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
} as const

namespace styles {
  export const action = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralMuted}`,
    borderRadius: '6px',
    flex: 1,
    height: '40px',
    justifyContent: 'center',
    ':active': { backgroundColor: 'bg.neutralWeak' },
  })

  export const actionLabel = style({
    color: 'fg.neutral',
    typography: 't4Medium',
  })

  export const actions = style({ ...row, gap: '8px', marginTop: '16px' })

  export const avatar = style({
    backgroundColor: 'palette.gray200',
    borderRadius: '24px',
    flexShrink: 0,
    height: '48px',
    width: '48px',
  })

  export const avatarImage = style({
    borderRadius: '24px',
    height: '100%',
    width: '100%',
  })

  export const badge = style({
    ...row,
    border: `1px solid ${vars.color.stroke.neutralSubtle}`,
    borderRadius: '4px',
    gap: '4px',
    padding: '3px 6px',
  })

  export const badgeIcon = style({
    backgroundColor: 'fg.positive',
    borderRadius: '6px',
    height: '12px',
    width: '12px',
  })

  export const badgeLabel = style({
    color: 'fg.neutralMuted',
    typography: 't2Regular',
  })

  export const badges = style({
    ...row,
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '12px',
  })

  export const heading = style({ color: 'fg.neutral', typography: 't6Bold' })

  export const identity = style({ ...column, flex: 1, gap: '2px', minWidth: 0 })

  export const nickname = style({
    color: 'fg.neutral',
    flexShrink: 1,
    minWidth: 0,
    textOverflow: 'ellipsis',
    typography: 't5Bold',
    whiteSpace: 'nowrap',
  })

  export const nicknameRow = style({ ...row, gap: '4px' })

  export const otherPost = style({
    ...row,
    gap: '12px',
    paddingBottom: '12px',
    paddingTop: '12px',
  })

  export const otherPostMeta = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const otherPosts = style({ ...column, marginTop: '20px' })

  export const otherPostsTitle = style({
    color: 'fg.neutral',
    typography: 't4Bold',
  })

  export const otherPostText = style({
    ...column,
    flex: 1,
    gap: '2px',
    minWidth: 0,
  })

  export const otherPostThumbnail = style({
    backgroundColor: 'palette.gray200',
    borderRadius: '6px',
    flexShrink: 0,
    height: '48px',
    width: '48px',
  })

  export const otherPostTitle = style({
    color: 'fg.neutral',
    textOverflow: 'ellipsis',
    typography: 't4Regular',
    whiteSpace: 'nowrap',
  })

  export const profile = style({ ...row, gap: '12px', marginTop: '16px' })

  export const root = style({ ...column, width: '100%' })

  export const separator = style({
    backgroundColor: 'stroke.neutralSubtle',
    height: '1px',
  })

  export const stat = style({
    ...column,
    alignItems: 'center',
    flex: 1,
    gap: '2px',
  })

  export const statLabel = style({
    color: 'fg.neutralSubtle',
    typography: 't2Regular',
  })

  export const stats = style({
    ...row,
    backgroundColor: 'bg.neutralWeak',
    borderRadius: '10px',
    marginTop: '16px',
    padding: '14px 0',
  })

  export const statSeparator = style({
    backgroundColor: 'stroke.neutralMuted',
    height: '24px',
    width: '1px',
  })

  export const statValue = style({ color: 'fg.neutral', typography: 't5Bold' })

  export const summary = style({
    color: 'fg.neutralSubtle',
    typography: 't3Regular',
  })

  export const temperature = style({
    ...column,
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: '4px',
  })

  export const temperatureRange = style({
    backgroundColor: 'palette.green500',
    borderRadius: '2px',
    height: '100%',
    width: '42%',
  })

  export const temperatureTrack = style({
    backgroundColor: 'bg.neutralMuted',
    borderRadius: '2px',
    height: '4px',
    overflow: 'hidden',
    width: '56px',
  })

  export const temperatureValue = style({
    color: 'palette.green500',
    typography: 't5Bold',
  })

  export const verified = style({
    backgroundColor: 'bg.informativeSolid',
    borderRadius: '7px',
    flexShrink: 0,
    height: '14px',
    width: '14px',
  })
}
