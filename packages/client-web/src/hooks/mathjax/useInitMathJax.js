import { insert } from 'mathjax-full/js/util/Options'

import addToQueue from './addToQueue'

// if MathJax import has been triggered
let mathJaxImported = false

const getDefaultOptions = () => ({
  chtml: {
    fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2',
  },
  startup: {
    typeset: false,
  },
  tex: {
    packages: { '[+]': ['ams'] },
  },
})

const useInitMathJax = (options) => {
  if (process.browser) {
    if (!mathJaxImported) {
      mathJaxImported = true
      addToQueue(
        () => new Promise((resolve) => {
          // MathJax reads options from window.MathJax
          window.MathJax = insert(getDefaultOptions(), options)
          // support a custom pageReady function
          if (window.MathJax.startup.pageReady) {
            const customPageReady = window.MathJax.startup.pageReady
            window.MathJax.startup.pageReady = () => {
              resolve()
              customPageReady()
            }
          } else {
            window.MathJax.startup.pageReady = resolve
          }
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
