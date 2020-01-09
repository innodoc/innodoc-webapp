import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { showMessage } from '@innodoc/client-store/src/actions/ui'
import { parseLink } from '@innodoc/client-misc/src/util'
import getLinkInfo from '../../getLinkInfo'

const Index = () => null

Index.getInitialProps = async (ctx) => {
  if (ctx.store && ctx.res) {
    let contentType
    let contentId
    const course = courseSelectors.getCurrentCourse(ctx.store.getState())
    try {
      ;[contentType, contentId] = parseLink(course.homeLink)
    } catch (e) {
      ctx.store.dispatch(
        showMessage({
          title: 'Could not parse homeLink!',
          msg: e.message,
          level: 'fatal',
        })
      )
      return {}
    }
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
