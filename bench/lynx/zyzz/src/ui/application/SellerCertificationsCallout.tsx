import { style } from '../../zyzz.config.js'
import type { Certification } from '../../fixtures.js'

/** Green callout listing the seller's verified certifications. */
export function SellerCertificationsCallout(
  props: SellerCertificationsCallout.Props,
) {
  if (props.certifications.length === 0) return null

  return (
    <view {...styles.root()}>
      {props.certifications.map((certification) => (
        <view key={certification.label} {...styles.entry()}>
          <view {...styles.check()} />
          <text {...styles.description()}>
            <text {...styles.label()}>{certification.label}</text>
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

namespace styles {
  export const check = style({
    backgroundColor: 'fg.positive',
    borderRadius: '8px',
    flexShrink: 0,
    height: '16px',
    marginTop: '1px',
    width: '16px',
  })

  export const description = style({
    color: 'fg.neutralMuted',
    flex: 1,
    typography: 't3Regular',
    whiteSpace: 'normal',
  })

  export const entry = style({
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
  })

  export const label = style({ color: 'fg.positive', typography: 't4Bold' })

  export const root = style({
    backgroundColor: 'bg.positiveWeak',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '16px',
    padding: '14px 16px',
  })
}
