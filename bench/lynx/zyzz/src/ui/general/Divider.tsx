import { cx } from 'zyzz'
import { style } from '../../zyzz.config.js'

/** Horizontal separator in thin (hairline) or thick (section) weight. */
export function Divider(props: Divider.Props) {
  return (
    <view
      {...cx(
        props.weight === 'thick' && styles.thick(),
        props.weight !== 'thick' && styles.thin(),
        props.inset && styles.inset(),
      )}
    />
  )
}

export declare namespace Divider {
  type Props = {
    inset?: boolean
    weight?: 'thick' | 'thin'
  }
}

namespace styles {
  export const inset = style({
    marginLeft: '16px',
    marginRight: '16px',
    width: 'auto',
  })

  export const thick = style({
    backgroundColor: 'bg.layerBasement',
    flexShrink: 0,
    height: '8px',
    width: '100%',
  })

  export const thin = style({
    backgroundColor: 'stroke.neutralSubtle',
    flexShrink: 0,
    height: '1px',
    width: '100%',
  })
}
