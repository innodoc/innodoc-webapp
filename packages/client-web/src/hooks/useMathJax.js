import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import MathJaxContext from '../mathjax/MathJaxContext'

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
let mathJaxIsLoading = false
let mathJaxIsReady = false

const typesetMathJax = (texCode, mathType, element, setNumFormulars, setTypesetStatus, onDone) => {
  setTypesetStatus(typesetStates.PENDING)
  setNumFormulars((numFormulars) => numFormulars + 1)
  console.log('TYPESET', texCode)
  const display = mathType === 'display'
  const options = window.MathJax.getMetricsFor(element, display)
  // const options = {}
  // console.log(options)
  window.MathJax
    .tex2chtmlPromise(texCode, { ...options, display })
    .then((mathJaxNodes) => {
      console.log('TYPESET DONE')
      console.log(document.getElementsByTagName('head')[0])
      document.getElementsByTagName('head')[0].appendChild(
        window.MathJax.chtmlStylesheet()
      )
      element.innerHTML = mathJaxNodes.outerHTML
      setTypesetStatus(typesetStates.SUCCESS)
      if (onDone) {
        onDone()
      }
    })
    .catch(() => setTypesetStatus(typesetStates.ERROR))
    .finally(() => setNumFormulars((numFormulars) => numFormulars - 1))
}

const removeMathJaxReadyCallback = (cb) => {
  for (let i = 0; i < mathJaxIsReadyCallbacks.length; i += 1) {
    if (mathJaxIsReadyCallbacks[i] === cb) {
      mathJaxIsReadyCallbacks.splice(i, 1)
      break
    }
  }
}

const useMathJaxGeneric = (texCode, mathType, deps, typesetDoneCallback) => {
  // const singleJax = typeof mathCode !== 'undefined'
  const mathJaxElem = useRef(null)
  const [typesetState, setTypesetStatus] = useState(typesetStates.INITIAL)
  const { options, setNumFormulars } = useContext(MathJaxContext)
  const [delimOpen, delimClose] = mathDelimiter[mathType]
  useEffect(
    () => {
      let needCallbackCleanup = false
      const typeset = () => (
        typesetMathJax(texCode, mathType, mathJaxElem.current, setNumFormulars, setTypesetStatus, typesetDoneCallback)
      )
      // if (singleJax) {
      //   const [delimOpen, delimClose] = mathDelimiter[mathType]
      //   mathJaxElem.current.innerHTML = `${delimOpen}${mathCode || ''}${delimClose}`
      // }

      if (process.browser) {
        if (mathJaxIsReady) {
          console.log('MJ READY')
          typeset()
        } else {
          needCallbackCleanup = true
          mathJaxIsReadyCallbacks.push(typeset)
          if (mathJaxIsLoading) {
            console.log('MJ LOADING')
          } else {
            console.log('MJ LOAD!')
            mathJaxIsLoading = true
            const pageReady = () => {
              mathJaxIsReady = true
              for (let i = 0; i < mathJaxIsReadyCallbacks.length; i += 1) {
                mathJaxIsReadyCallbacks[i]()
              }
              mathJaxIsReadyCallbacks = []
            }
            window.MathJax = mathJaxOptions(options, pageReady)
            import(
              /* webpackChunkName: "mathjax" */
              '../mathjax/mathjax-bundle'
            )
          }
        }
      }

      return () => {
        if (needCallbackCleanup) {
          removeMathJaxReadyCallback(typeset)
        }
      }
    },
    [texCode]
    // singleJax ? [mathCode] : deps
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
