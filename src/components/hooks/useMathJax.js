import { useEffect, useRef, useState } from 'react'
import loadScript from 'load-script'

const MATHJAX_SCRIPT_ID = '__MATHJAX_SCRIPT__'

const mathJaxDebug = process.env.NODE_ENV !== 'production'

const mathDelimiter = {
  inline: ['\\(', '\\)'],
  display: ['\\[', '\\]'],
}

const typesetStates = {
  PENDING: 0,
  SUCCESS: 1,
  ERROR: 2,
}

const mathJaxOptions = (cb) => ({
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

// keeps callbacks for all MathJax-enabled components page-wide
let mathJaxReadyCallbacks = []

// if injection has been triggered already
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

const isMathJaxLoaded = () => (
  document.getElementById(MATHJAX_SCRIPT_ID)
    && window.MathJax
    && window.MathJax.isReady
)

const removeAllJaxes = (element) => {
  if (element) {
    const allJaxes = window.MathJax.Hub.getAllJax(element)
    for (let i = 0; i < allJaxes.length; i += 1) {
      window.MathJax.Hub.Queue(['Remove', allJaxes[i]])
    }
  }
}

const onTypesettingDone = (element, setTypesetStatus) => {
  const allJaxes = window.MathJax.Hub.getAllJax(element)
  for (let i = 0; i < allJaxes.length; i += 1) {
    if (allJaxes[i].texError) {
      setTypesetStatus(typesetStates.ERROR)
      return
    }
  }
  setTypesetStatus(typesetStates.SUCCESS)
}

// Auto-typeset whole element
const typesetMathJax = (element, setTypesetStatus, onDone) => {
  setTypesetStatus(typesetStates.PENDING)
  window.MathJax.Hub.Queue([
    'Typeset',
    window.MathJax.Hub,
    element,
    () => {
      onTypesettingDone(element, setTypesetStatus)
      if (onDone) { onDone() }
    },
  ])
}

const removeMathJaxOnLoadCallback = (cb) => {
  for (let i = 0; i < mathJaxReadyCallbacks.length; i += 1) {
    if (mathJaxReadyCallbacks[i] === cb) {
      mathJaxReadyCallbacks.splice(i, 1)
      break
    }
  }
}

const useMathJaxGeneric = (mathCode, mathType, deps, typesetDoneCallback) => {
  const singleJax = typeof mathCode !== 'undefined'
  const mathJaxElem = useRef(null)
  const [typesetState, setTypesetStatus] = useState(typesetStates.INITIAL)
  useEffect(
    () => {
      const typeset = () => typesetMathJax(
        mathJaxElem.current, setTypesetStatus, typesetDoneCallback
      )
      let callbackCleanup = false
      if (singleJax) {
        const [delimOpen, delimClose] = mathDelimiter[mathType]
        mathJaxElem.current.innerHTML = `${delimOpen}${mathCode || ''}${delimClose}`
      }
      if (isMathJaxLoaded()) {
        typeset()
      } else {
        injectMathJax(typeset)
        callbackCleanup = true
      }
      return () => {
        if (singleJax && isMathJaxLoaded()) {
          removeAllJaxes(mathJaxElem.current)
        }
        if (callbackCleanup) {
          removeMathJaxOnLoadCallback(typeset)
        }
      }
    },
    singleJax ? [mathCode] : deps
  )
  return { mathJaxElem, typesetState }
}

// Render a single formula
const useMathJax = (mathCode, mathType = 'inline') => useMathJaxGeneric(
  mathCode, mathType, undefined
)

// Scan an entire element tree for formulas
const useMathJaxScanElement = (deps, typesetDoneCallback) => useMathJaxGeneric(
  undefined, undefined, deps, typesetDoneCallback
)

// Remove a Jax that was created by a parent useMathJaxScanElement on unmount
const useMathJaxRemoveOnUnmount = () => {
  const mathJaxElem = useRef(null)
  useEffect(() => (
    () => {
      if (isMathJaxLoaded()) {
        removeAllJaxes(mathJaxElem.current)
      }
    }
  ), [])
  return mathJaxElem
}

export {
  mathDelimiter,
  typesetStates,
  useMathJaxRemoveOnUnmount,
  useMathJaxScanElement,
}
export default useMathJax
