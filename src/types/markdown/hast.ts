import type { Element, Properties } from 'hast'

import type { HastMdxJsxFlowDivElementName } from '#ui/components/content/markdown/block/DivNode'
import type { HastMdxJsxTextSpanElementName } from '#ui/components/content/markdown/inline/SpanNode'

/** Custom document root that is marked and is rendered as fragment */
export interface HastRootDivElement extends Element {
  tagName: 'div'
  properties: { root: 'true' }
}

interface HastMdxJsxFlowDivElementProperties extends Properties {
  name: HastMdxJsxFlowDivElementName
}

/** `MdxJsxFlowElement` as hast element */
export interface HastMdxJsxFlowDivElement extends Element {
  tagName: 'div'
  properties: HastMdxJsxFlowDivElementProperties
}

interface HastMdxJsxFlowDivElementTabsProperties extends HastMdxJsxFlowDivElementProperties {
  name: 'Tabs'
  labels: string[]
}

/** `<Tabs />` as hast element */
export interface HastMdxJsxFlowDivElementTabs extends HastMdxJsxFlowDivElement {
  properties: HastMdxJsxFlowDivElementTabsProperties
}

interface HastMdxJsxFlowDivElementTabItemProperties extends HastMdxJsxFlowDivElementProperties {
  name: 'TabItem'
  label: string
  index: string
}

/** `<TabItem />` as hast element */
export interface HastMdxJsxFlowDivElementTabItem extends Element {
  properties: HastMdxJsxFlowDivElementTabItemProperties
}

interface HastMdxJsxTextSpanElementProperties extends Properties {
  name: HastMdxJsxTextSpanElementName
}

export interface HastMdxJsxTextSpanElement extends Element {
  tagName: 'span'
  properties: HastMdxJsxTextSpanElementProperties
}
