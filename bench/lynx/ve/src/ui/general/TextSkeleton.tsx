import * as styles from './TextSkeleton.css.js'

/** Gray placeholder bar sized like a line of text. */
export function TextSkeleton(props: TextSkeleton.Props) {
  return (
    <view
      className={`${styles.root} ${props.size === 'block' ? styles.block : styles.line}`}
      style={{ width: props.width }}
    />
  )
}

export declare namespace TextSkeleton {
  type Props = {
    size?: 'block' | 'line'
    width: string
  }
}
