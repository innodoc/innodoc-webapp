import type { Root } from 'mdast'
import type {
  MdxJsxAttribute,
  MdxJsxFlowElement,
  MdxJsxFlowElementHast,
  MdxJsxTextElement,
} from 'mdast-util-mdx-jsx'
import { convert } from 'unist-util-is'

// mdast

export const isMdastRoot = convert<Root>('root')

export const isMdxJsxAttribute = convert<MdxJsxAttribute>('mdxJsxAttribute')
export const isMdxJsxFlowElement = convert<MdxJsxFlowElement>('mdxJsxFlowElement')
export const isMdxJsxTextElement = convert<MdxJsxTextElement>('mdxJsxTextElement')

// hast

export const isMdxJsxFlowElementHast = convert<MdxJsxFlowElementHast>('mdxJsxFlowElement')
