import { useState } from 'react'
import { insert } from 'mathjax-full/js/util/Options'

import addToQueue from './addToQueue'

const mathDelimiter = {
  inline: ['\\(', '\\)'],
  display: ['\\[', '\\]'],
}

const getDefaultOptions = () => ({
  startup: { typeset: false },
  tex: { packages: { '[+]': ['ams'] } },
  chtml: { fontURL: `${window.location.origin}/fonts/mathjax-woff-v2` },
})

const useInitMathJax = (options) => {
  // MathJax import has been triggered
  const [mathJaxImported, setMathJaxImported] = useState(false)
  if (process.browser) {
    console.log('useInitMathJax')
    if (!mathJaxImported) {
      console.log('useInitMathJax: importing')
      setMathJaxImported(true)
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
