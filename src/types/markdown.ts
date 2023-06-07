import type { Element, Properties } from 'hast'

import type { MdxJsxFlowDivElementName } from '#ui/components/content/markdown/block/DivNode'
import type { MdxJsxTextSpanElementName } from '#ui/components/content/markdown/inline/SpanNode'

export interface RootDivElement extends Element {
  tagName: 'div'
  properties: { root: 'true' }
}

interface MdxJsxFlowDivElementProperties extends Properties {
  name: MdxJsxFlowDivElementName
}

export interface MdxJsxFlowDivElement extends Element {
  tagName: 'div'
  properties: MdxJsxFlowDivElementProperties
}

interface MdxJsxTextSpanElementProperties extends Properties {
  name: MdxJsxTextSpanElementName
}

export interface MdxJsxTextSpanElement extends Element {
  tagName: 'span'
  properties: MdxJsxTextSpanElementProperties
}
