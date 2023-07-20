import type { Element } from 'hast'

import { isHastMdxJsxFlowDivElementTabItem, isHastMdxJsxFlowDivElementTabs } from '#type-guards'

let tabIndex = 0

/**
 * Support tabs/tab items
 *
 * In order to render tabs/tab items, we append a list of tab labels to tabs
 * and a numeric index to each tab item.
 */
function tabs(el: Element) {
  if (isHastMdxJsxFlowDivElementTabs(el)) {
    // Add list of tab labels to tabs
    tabIndex = 0
    el.properties.labels = []
    for (const child of el.children) {
      if (isHastMdxJsxFlowDivElementTabItem(child)) {
        el.properties.labels.push(child.properties.label)
      }
    }
    return
  }

  // Add index property to tab items
  if (isHastMdxJsxFlowDivElementTabItem(el)) {
    el.properties.index = (tabIndex++).toString()
  }
}

export default tabs
