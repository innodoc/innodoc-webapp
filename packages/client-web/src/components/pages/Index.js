import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { parseLink } from '@innodoc/client-misc/src/util'
import getLinkInfo from '../../getLinkInfo'

const Index = () => null

Index.getInitialProps = async (ctx) => {
  if (ctx.store && ctx.res) {
    const course = courseSelectors.getCurrentCourse(ctx.store.getState())
    if (!course) {
      throw new Error('Could not retrieve course!')
    }

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
  return {}
}

export default Index
