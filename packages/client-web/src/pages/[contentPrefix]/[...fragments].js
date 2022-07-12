import ContentPage from '../../components/pages/ContentPage'
import getStaticPaths from '../../lib/content/getStaticPaths'
import getStaticContentProps from '../../lib/content/getStaticProps'
import serverBootstap from '../../lib/serverBootstrap'

const getStaticProps = serverBootstap(getStaticContentProps)

export { getStaticPaths, getStaticProps }
export default ContentPage
