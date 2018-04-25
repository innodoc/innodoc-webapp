import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-unfetch'
import loadScript from 'load-script'

import Layout from '../components/Layout.js'
import ContentFragment from '../components/ContentFragment.js'

export default class Page extends React.Component {

  static propTypes = {
    content: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  static async getInitialProps() {
    const res = await fetch('http://localhost:3000/static/vbkm01.json')
    const content = await res.json()
    return { content: content }
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
        <div ref={(node) => {this.mathJaxNode = node}}>
          <ContentFragment content={this.props.content} />
        </div>
      </Layout>
    )
  }

}
