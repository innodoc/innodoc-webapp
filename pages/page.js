import React from 'react'
import PropTypes from 'prop-types'
import loadScript from 'load-script'
import { connect } from 'react-redux'

import { loadPage } from '../store/actions/content'
import Layout from '../components/Layout'
import ContentFragment from '../components/ContentFragment'
import withI18next from '../lib/withI18next'

class CoursePage extends React.Component {
  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props)
    this.mathJaxNode = React.createRef()
    this.state = {
      loaded: false,
    }
  }

  static getInitialProps({ query, store }) {
    store.dispatch(loadPage(query.section))
  }

  componentDidMount() {
    if (this.state.loaded) {
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
    this.setState({
      loaded: true,
    })
    if (err) { throw new Error(err) }
    this.typesetMathJax()
  }

  typesetMathJax() {
    if (this.mathJaxNode) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.mathJaxNode.current])
    }
  }

  render() {
    return (
      <Layout sidebar>
        <div ref={this.mathJaxNode}>
          <ContentFragment content={this.props.content} />
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  content: state.content.page,
})

export default connect(mapStateToProps)(withI18next()(CoursePage))
