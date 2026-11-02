import type { Certification } from '../../fixtures.js'
import * as styles from './AuthorCertificationsCallout.css.js'

/** Green callout listing the author's verified certifications. */
export function AuthorCertificationsCallout(
  props: AuthorCertificationsCallout.Props,
) {
  if (props.certifications.length === 0) return null

  return (
    <view className={styles.root}>
      {props.certifications.map((certification) => (
        <view key={certification.label} className={styles.entry}>
          <view className={styles.check} />
          <text className={styles.description}>
            <text className={styles.label}>{certification.label}</text>
            {`  ${certification.description}`}
          </text>
        </view>
      ))}
    </view>
  )
}

export declare namespace AuthorCertificationsCallout {
  type Props = {
    certifications: readonly Certification[]
  }
}
