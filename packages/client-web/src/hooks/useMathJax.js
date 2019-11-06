import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import loadScript from 'load-script'

import MathJaxOptionsContext from '../mathjax/MathJaxOptionsContext'

const MATHJAX_SCRIPT_ID = '__MATHJAX_SCRIPT__'

const mathDelimiter = {
  inline: ['\\(', '\\)'],
  display: ['\\[', '\\]'],
}

const typesetStates = {
  INITIAL: 0,
  PENDING: 1,
  SUCCESS: 2,
  ERROR: 3,
}

const mathJaxOptions = (mathJaxOpts, pageReady) => {
  const opts = {
    startup: {
      pageReady,
      typeset: false,
    },
    tex: {
      inlineMath: [mathDelimiter.inline],
      displayMath: [mathDelimiter.display],
      packages: { '[+]': ['ams'] },
    },
  }
  try {
    opts.loader = mathJaxOpts.loader
    opts.tex.packages['[+]'] = [
      ...opts.tex.packages['[+]'],
      ...mathJaxOpts.tex.packages['[+]'],
    ]
  } catch {
    // ignore missing mathJaxOpts
  }
  return opts
}

// keeps callbacks for all MathJax-enabled components page-wide
let mathJaxIsReadyCallbacks = []

// if injection has been triggered already
let mathJaxInjected = false
let mathJaxIsReady = false

const injectMathJax = (mathJaxOpts, cb) => {
  if (process.browser) {
    mathJaxIsReadyCallbacks.push(cb)
    if (!mathJaxInjected) {
      mathJaxInjected = true
      const pageReady = () => {
        for (let i = 0; i < mathJaxIsReadyCallbacks.length; i += 1) {
          mathJaxIsReadyCallbacks[i]()
        }
        mathJaxIsReadyCallbacks = []
        mathJaxIsReady = true
      }
      window.MathJax = mathJaxOptions(mathJaxOpts, pageReady)
      loadScript(
        '/js/MathJax/mathjax-bundle.js',
        { attrs: { id: MATHJAX_SCRIPT_ID } },
      )
    }
  }
}

const typesetMathJax = (element, setTypesetStatus, onDone) => {
  setTypesetStatus(typesetStates.PENDING)
  window.MathJax
    .typesetPromise([element])
    .then(() => {
      setTypesetStatus(typesetStates.SUCCESS)
      if (onDone) {
        onDone()
      }
    })
    .catch(() => {
      setTypesetStatus(typesetStates.ERROR)
    })
}

const removeMathJaxOnLoadCallback = (cb) => {
  for (let i = 0; i < mathJaxIsReadyCallbacks.length; i += 1) {
    if (mathJaxIsReadyCallbacks[i] === cb) {
      mathJaxIsReadyCallbacks.splice(i, 1)
      break
    }
  }
}

const useMathJaxGeneric = (mathCode, mathType, deps, typesetDoneCallback) => {
  const singleJax = typeof mathCode !== 'undefined'
  const mathJaxElem = useRef(null)
  const [typesetState, setTypesetStatus] = useState(typesetStates.INITIAL)
  const customMathJaxOptions = useContext(MathJaxOptionsContext)
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
      if (mathJaxIsReady) {
        typeset()
      } else {
        injectMathJax(customMathJaxOptions, typeset)
        callbackCleanup = true
      }
      return () => {
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

export {
  mathDelimiter,
  typesetStates,
  useMathJaxScanElement,
}
export default useMathJax
