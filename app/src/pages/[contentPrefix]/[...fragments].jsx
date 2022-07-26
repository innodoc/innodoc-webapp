import PropTypes from 'prop-types'

import MathJax from '@innodoc/react-mathjax-node'
import { PageContent, SectionContent } from '@innodoc/ui/content'
import Layout from '@innodoc/ui/layout'

import getStaticPaths from '../../lib/content/getStaticPaths.js'
import getStaticContentProps from '../../lib/content/getStaticProps.js'
import serversideBootstrap from '../../lib/serversideBootstrap.js'

function ContentPage({ contentType }) {
  const Component = contentType === 'page' ? PageContent : SectionContent

  return (
    <Layout>
      <MathJax.Provider>
        <Component />
      </MathJax.Provider>
    </Layout>
  )
}

ContentPage.propTypes = {
  contentType: PropTypes.oneOf(['page', 'section']).isRequired,
}

const getStaticProps = serversideBootstrap(getStaticContentProps)

export { getStaticPaths, getStaticProps }
export default ContentPage
