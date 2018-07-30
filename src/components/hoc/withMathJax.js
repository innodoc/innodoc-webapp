import React from 'react'
import PropTypes from 'prop-types'
import loadScript from 'load-script'

import { getHocDisplayName } from '../../lib/util'

const MATHJAX_SCRIPT_ID = '__MATHJAX_SCRIPT__'

const debug = process.env.NODE_ENV !== 'production'

// TODO: this currently works with just one MathJax component per page.
// test if it's possible to have several components (or even call typeset
// manually on every span)

const mathJaxOptions = cb => ({
  skipStartupTypeset: true,
  showMathMenu: debug,
  showProcessingMessages: debug,
  messageStyle: debug ? 'none' : 'normal',
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
  // stuff that depends on MathJax being available goes into AuthorInit
  AuthorInit: () => {
    // path to our custom MathJax extension (needs to be absolute)
    window.MathJax.Ajax.config.path.innodoc = `${window.location.origin}/static`
    // register start-up hook
    window.MathJax.Hub.Register.StartupHook('End', cb)
  },
})

const withMathJax = (WrappedComponent) => {
  class WithMathJax extends React.Component {
    static isMathJaxLoaded() {
      return document.getElementById(MATHJAX_SCRIPT_ID)
        && window.MathJax
        && window.MathJax.isReady
    }

    mathJaxContentRef = React.createRef()

    constructor() {
      super()
      this.typesetMathJax = this.typesetMathJax.bind(this)
    }

    componentDidMount() {
      if (!WithMathJax.isMathJaxLoaded()) {
        this.injectMathJax()
      }
    }

    injectMathJax() {
      window.MathJax = mathJaxOptions(this.typesetMathJax)
      loadScript(
        '/static/vendor/MathJax/unpacked/MathJax.js',
        { attrs: { id: MATHJAX_SCRIPT_ID } },
        (err) => { if (err) { throw new Error(err) } }
      )
    }

    typesetMathJax() {
      if (WithMathJax.isMathJaxLoaded()) {
        const elem = this.mathJaxContentRef.current
        if (elem) {
          window.MathJax.Hub.Queue([
            'Typeset',
            window.MathJax.Hub,
            elem,
          ])
        }
      }
    }

    render() {
      return (
        <WrappedComponent
          mathJaxContentRef={this.mathJaxContentRef}
          typesetMathJax={this.typesetMathJax}
          {...this.props}
        />
      )
    }
  }

  WithMathJax.displayName = getHocDisplayName('WithMathJax', WrappedComponent)
  return WithMathJax
}

withMathJax.propTypes = {
  WrappedComponent: PropTypes.element,
}

export default withMathJax
