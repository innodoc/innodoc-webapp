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

// MathJax loading has been triggered
let mathJaxIsLoading = false

// MathJax is ready to operate
let mathJaxIsReady = false

// current MathJax promise
let currentPromise

const loadMathJax = (options) => new Promise((resolve) => {
  mathJaxIsLoading = true
  window.MathJax = mathJaxOptions(options, () => {
    mathJaxIsReady = true
    resolve()
  })
  import(
    /* webpackChunkName: "mathjax" */
    '../mathjax/mathjax-bundle'
  )
})

const useLoadMathJax = (options) => {
  const [mathJaxReady, setMathJaxReady] = useState(false)

  if (process.browser) {
    if (!mathJaxIsLoading) {
      currentPromise = loadMathJax(options).then(() => setMathJaxReady(true))
    } else if (mathJaxIsReady && !mathJaxReady) {
      setMathJaxReady(true)
    }
  }

  return mathJaxReady
}

const useMathJax = (texCode, mathType = 'inline') => {
  // console.log('useMathJax')
  const mathJaxElem = useRef(null)
  // const [typesetState, setTypesetStatus] = useState(typesetStates.INITIAL)
  const { setFormularsProcessing } = useContext(MathJaxContext)

  // load MathJax and trigger typesetting
  useEffect(
    () => {
      if (process.browser) {
        if (!currentPromise) {
          throw new Error('Did you forget to use the MathJaxProvider?')
        }
        // queue typeset after last operation
        currentPromise.then(() => {
          if (mathJaxElem.current) {
            console.log('useMathJax')
            setFormularsProcessing((prev) => prev + 1)
            const display = mathType === 'display'
            const metrics = window.MathJax.getMetricsFor(mathJaxElem.current, display)
            console.log(metrics)
            currentPromise = window.MathJax
              .tex2chtmlPromise(texCode, { ...metrics, display })
              .then((mathJaxNodes) => {
                // add chtml styles
                const chtmlStylesheet = window.MathJax.chtmlStylesheet()
                const existingChtmlStylesheet = document.getElementById(chtmlStylesheet.id)
                if (existingChtmlStylesheet) {
                  existingChtmlStylesheet.parentNode.replaceChild(
                    chtmlStylesheet, existingChtmlStylesheet)
                } else {
                  document.getElementsByTagName('head')[0].appendChild(chtmlStylesheet)
                }
                // add rendered nodes
                mathJaxElem.current.innerHTML = mathJaxNodes.outerHTML
                // setTypesetStatus(typesetStates.SUCCESS)
                // if (onDone) {
                //   onDone()
                // }
              })
          }
          setFormularsProcessing((prev) => prev - 1)
        })
      }
    },
    [texCode]
  )

  return { mathJaxElem }
}

export { mathDelimiter, typesetStates, useLoadMathJax }
export default useMathJax
