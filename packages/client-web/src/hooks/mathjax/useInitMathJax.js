import { insert } from 'mathjax-full/js/util/Options'

import addToQueue from './addToQueue'

// if MathJax import has been triggered
let mathJaxImported = false

const getDefaultOptions = () => ({
  startup: { typeset: false },
  tex: { packages: { '[+]': ['ams'] } },
  chtml: { fontURL: `${window.location.origin}/fonts/mathjax-woff-v2` },
})

const useInitMathJax = (options) => {
  if (process.browser) {
    if (!mathJaxImported) {
      mathJaxImported = true
      addToQueue(
        () => new Promise((resolve) => {
          // MathJax reads options from window.MathJax
          window.MathJax = insert(getDefaultOptions(), options)
          window.MathJax.startup.pageReady = resolve
          import(
            /* webpackChunkName: "mathjax" */
            '../../mathjax/mathjax-bundle'
          )
        })
      )
    }
  }
}

export default useInitMathJax
