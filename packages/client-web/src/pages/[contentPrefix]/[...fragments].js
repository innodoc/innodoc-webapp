import ContentPage from '../../components/pages/ContentPage'
import getStaticPaths from '../../lib/content/getStaticPaths'
import getStaticContentProps from '../../lib/content/getStaticProps'
import serversideBootstrap from '../../lib/serversideBootstrap'

const getStaticProps = serversideBootstrap(getStaticContentProps)

export { getStaticPaths, getStaticProps }
export default ContentPage
