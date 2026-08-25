import type { Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import type { Processor } from 'unified'

type MarkdownToHastProcessor = Processor<MdastRoot, MdastRoot, HastRoot>

export type {
  HastMdxJsxFlowDivElement,
  HastMdxJsxFlowDivElementTabItem,
  HastMdxJsxFlowDivElementTabs,
  HastMdxJsxTextSpanElement,
  HastRootDivElement,
} from '@innodoc/shared-core/types'

export type { MarkdownToHastProcessor }
