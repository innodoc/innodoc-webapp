import type { Element, Properties } from 'hast'

import type {
  HAST_MDX_JSX_FLOW_DIV_ELEMENT_NAME,
  HAST_MDX_JSX_TEXT_SPAN_ELEMENT_NAME,
} from '@innodoc/constants'

/** Custom document root that is marked and is rendered as fragment */
export interface HastRootDivElement extends Element {
  tagName: 'div'
  properties: { root: 'true' }
}

interface HastMdxJsxFlowDivElementProperties extends Properties {
  name: (typeof HAST_MDX_JSX_FLOW_DIV_ELEMENT_NAME)[number]
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
  name: (typeof HAST_MDX_JSX_TEXT_SPAN_ELEMENT_NAME)[number]
}

export interface HastMdxJsxTextSpanElement extends Element {
  tagName: 'span'
  properties: HastMdxJsxTextSpanElementProperties
}
