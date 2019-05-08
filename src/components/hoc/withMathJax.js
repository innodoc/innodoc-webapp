import React from 'react'
import loadScript from 'load-script'

import { getHocDisplayName } from '../../lib/util'

const MATHJAX_SCRIPT_ID = '__MATHJAX_SCRIPT__'

const debug = process.env.NODE_ENV !== 'production'

// TODO
// - this.typesetOnReady should be an array of callbacks?
// - this hoc can be converted to custom hook?

const mathJaxOptions = cb => ({
  skipStartupTypeset: true,
  showMathMenu: debug,
  showProcessingMessages: debug,
  messageStyle: debug ? 'none' : 'normal',
  jax: ['input/TeX', 'output/HTML-CSS'],
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

    // Reference to the DOM element that typeset is called on
    mathJaxContentRef = React.createRef()

    // The wrapped component might trigger typesetting during initialization
    // we need to remember this and trigger it once MathJax is ready.
    typesetOnReady = false

    constructor() {
      super()
      this.typesetMathJax = this.typesetMathJax.bind(this)
      this.onMathJaxReady = this.onMathJaxReady.bind(this)
    }

    componentDidMount() {
      if (!WithMathJax.isMathJaxLoaded()) {
        this.injectMathJax()
      }
    }

    onMathJaxReady() {
      if (this.typesetOnReady) {
        const cb = this.typesetOnReady
        this.typesetOnReady = false
        this.typesetMathJax(cb)
      }
    }

    injectMathJax() {
      window.MathJax = mathJaxOptions(this.onMathJaxReady)
      loadScript(
        '/static/vendor/MathJax/unpacked/MathJax.js',
        { attrs: { id: MATHJAX_SCRIPT_ID } },
      )
    }

    typesetMathJax(cb) {
      if (WithMathJax.isMathJaxLoaded()) {
        const elem = this.mathJaxContentRef.current
        if (elem) {
          window.MathJax.Hub.Queue([
            'Typeset',
            window.MathJax.Hub,
            elem,
            cb,
          ])
        }
      } else {
        this.typesetOnReady = cb
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

export default withMathJax
