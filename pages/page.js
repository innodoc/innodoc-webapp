import React from 'react'
import PropTypes from 'prop-types'
import loadScript from 'load-script'
import { connect } from 'react-redux'
import { Dimmer, Header, Loader, Image } from 'semantic-ui-react'

import { loadSection } from '../store/actions/content'
import getSectionById from '../lib/selectors'
import Layout from '../components/Layout'
import ContentFragment from '../components/ContentFragment'
import withI18next from '../lib/withI18next'

const Placeholder = () => (
  <React.Fragment>
    <Header as="h1">&nbsp;</Header>
    <p><Image src="/static/img/paragraph.png" /></p>
    <p><Image src="/static/img/paragraph.png" /></p>
  </React.Fragment>
)

class CoursePage extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    content: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    title: [],
    content: [],
  }

  constructor(props) {
    super(props)
    this.mathJaxNode = React.createRef()
    this.state = {
      mathJaxLoaded: false,
    }
  }

  static getInitialProps({ query, store }) {
    store.dispatch(loadSection(query.section))
  }

  componentDidMount() {
    if (this.state.mathJaxLoaded) {
      this.typesetMathJax()
    } else {
      window.MathJax = {
        skipStartupTypeset: true,
        jax: ['input/TeX', 'output/CommonHTML'],
        tex2jax: {
          inlineMath: [['\\(', '\\)']],
          displayMath: [['\\[', '\\]']],
        },
        extensions: [
          'tex2jax.js',
          'MathEvents.js',
          'MathMenu.js',
          'TeX/noErrors.js',
          'TeX/noUndefined.js',
          'TeX/AMSmath.js',
          'TeX/AMSsymbols.js',
          '[a11y]/accessibility-menu.js',
          '[innodoc]/innodoc.mathjax.js',
        ],
        AuthorInit: () => {
          window.MathJax.Ajax.config.path.innodoc = `${window.location.origin}/static`
        },
      }
      loadScript('/static/vendor/MathJax/unpacked/MathJax.js', this.onLoadMathJax)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.content !== this.props.content) { this.typesetMathJax() }
  }

  onLoadMathJax = (err) => {
    this.setState({ mathJaxLoaded: true })
    if (err) { throw new Error(err) }
    this.typesetMathJax()
  }

  typesetMathJax() {
    if (this.mathJaxNode) {
      window.MathJax.Hub.Queue([
        'Typeset',
        window.MathJax.Hub,
        this.mathJaxNode.current,
      ])
    }
  }

  render() {
    const { content, title, loading } = this.props
    // TODO: insert sub-TOC for section level <=2
    return (
      <Layout sidebar>
        <Dimmer.Dimmable dimmed={loading}>
          <Dimmer active={loading} inverted>
            <Loader active={loading} size="big" />
          </Dimmer>
          {
            loading
              ? <Placeholder />
              : (
                <React.Fragment>
                  <Header as="h1">
                    <ContentFragment content={title} />
                  </Header>
                  <div ref={this.mathJaxNode}>
                    <ContentFragment content={content} />
                  </div>
                </React.Fragment>
              )
          }
        </Dimmer.Dimmable>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  const props = { loading: state.content.loading }
  try {
    const sectionId = state.content.currentSectionId
    const { title } = getSectionById(state, sectionId)
    const content = state.content.sections[sectionId]
    return {
      ...props,
      content,
      title,
    }
  } catch (error) {
    if (!(error instanceof TypeError)) { throw error }
  }
  return props
}

export default connect(mapStateToProps)(withI18next()(CoursePage))
