import { parseLink } from '@innodoc/client-misc/src/util'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import getLinkInfo from '../../getLinkInfo'
import createHoc from './createHoc'

const withIndexRedirect = createHoc('WithIndexRedirect', async (ctx) => {
  if (ctx.store && ctx.res && ctx.asPath === '/') {
    const course = courseSelectors.getCurrentCourse(ctx.store.getState())

    let parsedHomeLink
    try {
      parsedHomeLink = parseLink(course.homeLink)
    } catch (e) {
      throw new Error(`Could not parse homeLink: ${course.homeLink}`)
    }
    const [contentType, contentId] = parsedHomeLink

    const { pagePathPrefix, sectionPathPrefix } = appSelectors.getApp(
      ctx.store.getState()
    )
    const pathPrefix =
      contentType === 'page' ? pagePathPrefix : sectionPathPrefix
    const linkInfo = getLinkInfo(pathPrefix, contentId)
    ctx.res.writeHead(301, { Location: linkInfo.as.pathname })
    ctx.res.end()
  }
})

export default withIndexRedirect
