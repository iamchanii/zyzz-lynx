import * as styles from './Divider.css.js'

/** Horizontal separator in thin (hairline) or thick (section) weight. */
export function Divider(props: Divider.Props) {
  return (
    <view
      className={`${props.weight === 'thick' ? styles.thick : styles.thin} ${props.inset ? styles.inset : ''}`}
    />
  )
}

export declare namespace Divider {
  type Props = {
    inset?: boolean
    weight?: 'thick' | 'thin'
  }
}
