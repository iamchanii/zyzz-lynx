import type { Certification } from '../../fixtures.js'
import * as styles from './SellerCertificationsCallout.css.js'

/** Green callout listing the seller's verified certifications. */
export function SellerCertificationsCallout(
  props: SellerCertificationsCallout.Props,
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

export declare namespace SellerCertificationsCallout {
  type Props = {
    certifications: readonly Certification[]
  }
}
