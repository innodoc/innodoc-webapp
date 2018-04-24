import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout.js'
import fetch from 'isomorphic-unfetch'
import loadScript from 'load-script'

class Page extends React.Component {

  static propTypes = {
    html: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  static async getInitialProps() {
    const res = await fetch('http://localhost:3000/static/vbkm01_01.html')
    const html = await res.text()
    return {
      html: html
    }
  }

  componentDidMount() {
    if (this.state.loaded)
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.content])
    else {
      window.MathJax = {
        skipStartupTypeset: true,
        jax: ["input/TeX", "output/CommonHTML"],
        extensions: [
          "tex2jax.js",
          "MathEvents.js",
          "MathMenu.js",
          "TeX/noErrors.js",
          "TeX/noUndefined.js",
          "TeX/AMSmath.js",
          "TeX/AMSsymbols.js",
          "[a11y]/accessibility-menu.js",
          "[innoconv]/innoconv.mathjax.js"
        ],
        // showProcessingMessages: true,
        AuthorInit: () => {
          window.MathJax.Ajax.config.path['innoconv'] = window.location.origin + '/static'
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
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.content])
  }

  render() {
    return (
      <Layout>
        <div
          dangerouslySetInnerHTML={{__html: this.props.html}}
          ref={(node) => {this.content = node}}
        />
      </Layout>
    )
  }

}

export default Page
