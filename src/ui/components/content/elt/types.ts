import type { EltMap, EltType } from 'pandoc-filter'

export type ContentComponentProps<A extends EltType> = {
  content: EltMap[A]
}
