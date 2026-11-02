import { cx } from 'zyzz'
import { style } from '../../zyzz.config.js'

/** Gray placeholder bar sized like a line of text. */
export function TextSkeleton(props: TextSkeleton.Props) {
  return (
    <view
      {...cx(
        styles.root(),
        props.size === 'block' && styles.block(),
        props.size !== 'block' && styles.line(),
      )}
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

namespace styles {
  export const block = style({ height: '22px' })

  export const line = style({ height: '16px' })

  export const root = style({
    backgroundColor: 'palette.gray200',
    borderRadius: '6px',
    flexShrink: 0,
  })
}
