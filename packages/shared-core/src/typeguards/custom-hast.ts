import { convertElement } from 'hast-util-is-element'
import type {
  HastMdxJsxFlowDivElement,
  HastMdxJsxFlowDivElementTabItem,
  HastMdxJsxFlowDivElementTabs,
  HastMdxJsxTextSpanElement,
  HastRootDivElement,
} from '#types'

/** Type guard for `HastRootDivElement` */
const isHastRootDivElement = convertElement(
  (el): el is HastRootDivElement => el.tagName === 'div' && el.properties.root === 'true',
)

/**
 * Type guard for `HastMdxJsxFlowDivElement`
 *
 * Dispatch keys on `name`, not on the `type: 'mdxJsxFlowElement'` marker the remark-rehype
 * handler also emits: `type` is not in any sanitize allowlist, so every real (sanitized)
 * tree carries only `name`. The marker's absence is pinned by `markdown-to-hast.test.ts`.
 */
const isHastMdxJsxFlowDivElement = convertElement(
  (el): el is HastMdxJsxFlowDivElement => el.tagName === 'div' && typeof el.properties.name === 'string',
)

/** Type guard for `HastMdxJsxTextSpanElement` */
const isHastMdxJsxTextSpanElement = convertElement(
  (el): el is HastMdxJsxTextSpanElement => el.tagName === 'span' && typeof el.properties.name === 'string',
)

/** Type guard for `HastMdxJsxFlowDivElementTabs` */
function isHastMdxJsxFlowDivElementTabs(el: unknown): el is HastMdxJsxFlowDivElementTabs {
  return isHastMdxJsxFlowDivElement(el) && el.properties.name === 'Tabs'
}

/** Type guard for `HastMdxJsxFlowDivElementTabItem` */
function isHastMdxJsxFlowDivElementTabItem(el: unknown): el is HastMdxJsxFlowDivElementTabItem {
  return isHastMdxJsxFlowDivElement(el) && el.properties.name === 'TabItem' && typeof el.properties.label === 'string'
}

export {
  isHastMdxJsxFlowDivElement,
  isHastMdxJsxFlowDivElementTabItem,
  isHastMdxJsxFlowDivElementTabs,
  isHastMdxJsxTextSpanElement,
  isHastRootDivElement,
}
