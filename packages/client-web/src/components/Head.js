/*
 We need to take care custom component styles come after Antd because they do
 override Antd defaults. We solve this by sorting the CSS links:
  1. "_app.js" -> App.js
  2. "/css/" -> 3rd-party styles (Antd)
  3. "/chunks/" -> Custom component styles
*/

import { Head as NextHead } from 'next/document'

const SEARCH_STRINGS = ['_app.js', '/css/', '/chunks/']

const findAndRemove = (links, q, rel) => {
  const link = links.find(
    (l) => l.props.href.includes(q) && l.props.rel === rel
  )
  if (link) {
    links.splice(links.indexOf(link), 1)
    return link
  }
  return undefined
}

export default class Head extends NextHead {
  getCssLinks() {
    const links = super.getCssLinks()
    return SEARCH_STRINGS.reduce((acc, searchStr) => {
      for (;;) {
        const plLink = findAndRemove(links, searchStr, 'preload')
        if (!plLink) break
        const sLink = findAndRemove(links, plLink.props.href, 'stylesheet')
        acc.push(plLink, sLink)
      }
      return acc
    }, [])
  }
}
