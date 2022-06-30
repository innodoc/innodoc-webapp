import ContentPage from '../../components/pages/ContentPage'
import { getContentPaths, getContentProps } from '../../lib/contentProps'
import serverBootstrap from '../../lib/serverBootstrap'
import nextReduxWrapper from '../../store'

export function getStaticPaths() {
  return getContentPaths()
}

export const getStaticProps = nextReduxWrapper.getStaticProps((store) => async (context) => {
  const props = await getContentProps(context, store)
  await serverBootstrap(store)
  return { props }
})

export default ContentPage
