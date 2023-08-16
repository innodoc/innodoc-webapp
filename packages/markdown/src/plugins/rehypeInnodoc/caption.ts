import type { Element } from 'hast'
// import { isElement } from 'hast-util-is-element'
// import { h } from 'hastscript'

// TODO how to do captions with MDX?

/** Support captions */
function caption(el: Element) {
  if (el.properties?.name === 'table' && el.properties.type === 'containerDirective') {
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
