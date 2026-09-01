import type { Element } from 'hast'
// import { isElement } from 'hast-util-is-element'
// import { h } from 'hastscript'

/**
 * TODO(captions): table captions are a deferred feature, not dead code to delete.
 *
 * This function is a no-op today (its body is commented out) yet is still
 * invoked for every element from `rehype-innodoc.ts`. The commented code
 * targets v1 `remark-container-directive` machinery that no longer exists in
 * this parser: nothing produces `properties.type === 'containerDirective'` or
 * a `directiveLabel` property, so the guard can never match. Note that
 * `rehypeInnodoc` runs BEFORE `rehype-sanitize`, so at call time the
 * `type: 'mdxJsxFlowElement'` marker set by `remark-rehype-handlers` is still
 * present on MDX flow elements — the branch is dead because the v1
 * `containerDirective` value is gone, not because the marker was sanitized
 * away, and in any case the body is commented out.
 *
 * Reviving captions needs a fresh design for how a caption is authored in MDX
 * (e.g. a `<TableCaption>` flow element mapped onto a real `<caption>`),
 * after which this visitor can be re-implemented or removed.
 */
function caption(el: Element) {
  if (el.properties.name === 'table' && el.properties.type === 'containerDirective') {
    // const [pChild, tableChild] = el.children
    // if (
    //   isElement(pChild) &&
    //   isElement(tableChild) &&
    //   pChild.tagName === 'p' &&
    //   pChild.properties?.directiveLabel === 'true' &&
    //   tableChild.tagName === 'table'
    // ) {
    //   // Put directiveLabel as <caption> where MUI table expects it
    //   el.children.splice(0, 1)
    //   tableChild.children.unshift(h('caption', undefined, pChild.children))
    // }
  }
}

export default caption
