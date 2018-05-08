import React from 'react'
import PropTypes from 'prop-types'
import loadScript from 'load-script'
import {connect} from 'react-redux'

import {loadPage} from '../store/actions'
import Layout from '../components/layout'
import ContentFragment from '../components/ContentFragment.js'

class CoursePage extends React.Component {

  static propTypes = {
    content: PropTypes.array.isRequired,
    url: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  static getInitialProps({query, store}) {
    store.dispatch(loadPage(query.title))
    return { content: [ {'t': 'Str', 'c': 'Loading…' } ] }
  }

  typesetMathJax() {
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.content])
  }

  componentDidMount() {
    if (this.state.loaded) {
      this.typesetMathJax()
    }
    else {
      window.MathJax = {
        skipStartupTypeset: true,
        jax: ['input/TeX', 'output/CommonHTML'],
        tex2jax:{
          inlineMath: [['\\(', '\\)']],
          displayMath: [['\\[', '\\]']]
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
          '[innodoc]/innodoc.mathjax.js'
        ],
        AuthorInit: () => {
          window.MathJax.Ajax.config.path['innodoc'] = window.location.origin + '/static'
        }
      }
      loadScript('/static/vendor/MathJax/unpacked/MathJax.js', this.onLoadMathJax)
    }
  }

  onLoadMathJax = (err) => {
    this.setState({
      loaded: true
    })
    if (err)
      throw new Error(err)
    this.typesetMathJax()
  }

  render() {
    return (
      <Layout>
        <ContentFragment content={this.props.content}
                         ref={(node) => {this.mathJaxNode = node}}
        />
      </Layout>
    )
  }

}

export default connect(state => ({content: state.content}))(CoursePage)
