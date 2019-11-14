import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import MathJaxOptionsContext from '../mathjax/MathJaxOptionsContext'

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
    chtml: {
      fontURL: `${window.location.origin}/fonts/mathjax-woff-v2`,
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

// if MathJax loading has been triggered
let mathJaxIsLoaded = false

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

const removeMathJaxReadyCallback = (cb) => {
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
      let needCallbackCleanup = false
      const typeset = () => (
        typesetMathJax(mathJaxElem.current, setTypesetStatus, typesetDoneCallback)
      )
      if (singleJax) {
        const [delimOpen, delimClose] = mathDelimiter[mathType]
        mathJaxElem.current.innerHTML = `${delimOpen}${mathCode || ''}${delimClose}`
      }

      if (process.browser) {
        if (mathJaxIsLoaded) {
          typeset()
        } else {
          const pageReady = () => {
            for (let i = 0; i < mathJaxIsReadyCallbacks.length; i += 1) {
              mathJaxIsReadyCallbacks[i]()
            }
            mathJaxIsReadyCallbacks = []
            mathJaxIsLoaded = true
          }
          window.MathJax = mathJaxOptions(customMathJaxOptions, pageReady)
          mathJaxIsReadyCallbacks.push(typeset)
          needCallbackCleanup = true
          import(
            /* webpackChunkName: "mathjax" */
            '../mathjax/mathjax-bundle'
          )
        }
      }

      return () => {
        if (needCallbackCleanup) {
          removeMathJaxReadyCallback(typeset)
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
