import React from 'react'
import PropTypes from 'prop-types'
import loadScript from 'load-script'

import { getHocDisplayName } from '../../lib/util'

const MATHJAX_SCRIPT_ID = '__MATHJAX_SCRIPT__'

const mathJaxDebug = process.env.NODE_ENV !== 'production'

// TODO
// - this hoc can be converted to custom hook?

const mathDelimiter = {
  inline: ['\\(', '\\)'],
  display: ['\\[', '\\]'],
}

const typesettingStates = {
  PENDING: 0,
  SUCCESS: 1,
  ERROR: 2,
}

const typesettingStatusType = PropTypes.oneOf(Object.values(typesettingStates))

const mathJaxOptions = cb => ({
  skipStartupTypeset: true,
  showMathMenu: mathJaxDebug,
  showProcessingMessages: mathJaxDebug,
  messageStyle: mathJaxDebug ? 'none' : 'normal',
  jax: ['input/TeX', 'output/HTML-CSS'],
  tex2jax: {
    inlineMath: [mathDelimiter.inline],
    displayMath: [mathDelimiter.display],
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

let mathJaxReadyCallbacks = []
let mathJaxInjected = false
const injectMathJax = (cb) => {
  if (process.browser) {
    mathJaxReadyCallbacks.push(cb)
    if (!mathJaxInjected) {
      mathJaxInjected = true
      window.MathJax = mathJaxOptions(() => {
        for (let i = 0; i < mathJaxReadyCallbacks.length; i += 1) {
          mathJaxReadyCallbacks[i]()
        }
        mathJaxReadyCallbacks = []
      })
      loadScript(
        '/static/vendor/MathJax/unpacked/MathJax.js',
        { attrs: { id: MATHJAX_SCRIPT_ID } },
      )
    }
  }
}

const withMathJax = (WrappedComponent) => {
  class WithMathJax extends React.Component {
    static isMathJaxLoaded() {
      return document.getElementById(MATHJAX_SCRIPT_ID)
        && window.MathJax
        && window.MathJax.isReady
    }

    constructor() {
      super()
      this.state = {
        mathJaxContentRef: React.createRef(),
        typesettingStatus: typesettingStates.PENDING,
      }
      this.onTypesettingDone = this.onTypesettingDone.bind(this)
      this.typesetMathJax = this.typesetMathJax.bind(this)
      this.updateMathJax = this.updateMathJax.bind(this)
    }

    componentDidMount() {
      if (WithMathJax.isMathJaxLoaded()) {
        this.typesetMathJax()
      } else {
        injectMathJax(this.typesetMathJax)
      }
    }

    componentWillUnmount() {
      for (let i = 0; i < mathJaxReadyCallbacks.length; i += 1) {
        if (mathJaxReadyCallbacks[i] === this.typesetMathJax) {
          mathJaxReadyCallbacks.splice(i, 1)
        }
      }
    }

    onTypesettingDone() {
      const { mathJaxContentRef } = this.state
      const allJaxes = window.MathJax.Hub.getAllJax(mathJaxContentRef.current)
      let typesettingStatus = typesettingStates.SUCCESS
      for (let i = 0; i < allJaxes.length; i += 1) {
        if (allJaxes[i].texError) {
          typesettingStatus = typesettingStates.ERROR
          break
        }
      }
      this.setState({ typesettingStatus })
    }

    // Update a single elementJax within the element
    updateMathJax(idx, text) {
      if (WithMathJax.isMathJaxLoaded()) {
        this.setState({ typesettingStatus: typesettingStates.PENDING }, () => {
          const { mathJaxContentRef } = this.state
          const elementJax = window.MathJax.Hub.getAllJax(mathJaxContentRef.current)[idx]
          if (elementJax) {
            window.MathJax.Hub.Queue(['Text', elementJax, text, this.onTypesettingDone])
          }
        })
      }
    }

    // Auto-typeset whole element
    typesetMathJax() {
      if (WithMathJax.isMathJaxLoaded()) {
        this.setState({ typesettingStatus: typesettingStates.PENDING }, () => {
          const { mathJaxContentRef } = this.state
          if (mathJaxContentRef.current) {
            this.removeAllJaxes()
            window.MathJax.Hub.Queue([
              'Typeset',
              window.MathJax.Hub,
              mathJaxContentRef.current,
              this.onTypesettingDone,
            ])
          }
        })
      }
    }

    removeAllJaxes() {
      const { mathJaxContentRef } = this.state
      if (WithMathJax.isMathJaxLoaded() && mathJaxContentRef) {
        const allJaxes = window.MathJax.Hub.getAllJax(mathJaxContentRef.current)
        for (let i = 0; i < allJaxes.length; i += 1) {
          window.MathJax.Hub.Queue(['Remove', allJaxes[i]])
        }
      }
    }

    render() {
      const { mathJaxContentRef, typesettingStatus } = this.state
      // settypesettingStatus={val => this.setState({ typesettingStatus: val })}
      return (
        <WrappedComponent
          mathJaxContentRef={mathJaxContentRef}
          removeAllJaxes={this.removeAllJaxes}
          typesetMathJax={this.typesetMathJax}
          typesettingStatus={typesettingStatus}
          updateMathJax={this.updateMathJax}
          {...this.props}
        />
      )
    }
  }

  WithMathJax.displayName = getHocDisplayName('WithMathJax', WrappedComponent)
  return WithMathJax
}

export {
  mathDelimiter,
  typesettingStates,
  typesettingStatusType,
}

export default withMathJax
