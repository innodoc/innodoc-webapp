import { parseLink } from '@innodoc/client-misc/src/util'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import getLinkInfo from '../../getLinkInfo'
import createHoc from './createHoc'

const withIndexRedirect = createHoc('WithIndexRedirect', (ctx) => {
  if (ctx.asPath === '/') {
    const state = ctx.store.getState()
    const course = courseSelectors.getCurrentCourse(state)
    const { pagePathPrefix, sectionPathPrefix } = appSelectors.getApp(state)

    let parsedHomeLink
    try {
      parsedHomeLink = parseLink(course.homeLink)
    } catch (e) {
      throw new Error(`Could not parse homeLink: ${course.homeLink}`)
    }
    const [contentType, contentId] = parsedHomeLink

    const pathPrefix = contentType === 'page' ? pagePathPrefix : sectionPathPrefix
    const linkInfo = getLinkInfo(pathPrefix, contentId)

    ctx.res.writeHead(301, { Location: linkInfo.as.pathname })
    ctx.res.end()

    // Remove i18next, otherwise it would try to send headers
    ctx.req.i18n = undefined
  }
})

export default withIndexRedirect
