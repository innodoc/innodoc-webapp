import React, {Component} from 'react'
import Layout from '../components/Layout.js'
import fetch from 'isomorphic-unfetch'
import loadScript from 'load-script'

class Page extends Component {

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
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.content])
    else {
      window.MathJax = {
        // extensions: ['[innoconv]innoconv.mathjax.js'],
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
          MathJax.Ajax.config.path['innoconv'] = window.location.origin + '/static'
          // MathJax.Hub.config.extensions.push("[innoconv]innoconv.mathjax.js");
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
      console.log(err)
    else
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.content])
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
