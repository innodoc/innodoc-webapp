import { useContext, useEffect, useRef } from 'react'

import addToQueue from './addToQueue'
import typesetStates from './states'
import MathJaxContext from '../../mathjax/MathJaxContext'

const TYPESETTING_DONE_TIMEOUT = 250

const updateCss = () => {
  // add chtml styles
  const chtmlStylesheet = window.MathJax.chtmlStylesheet()
  const existingChtmlStylesheet = document.getElementById(chtmlStylesheet.id)
  if (existingChtmlStylesheet) {
    existingChtmlStylesheet.parentNode.replaceChild(
      chtmlStylesheet, existingChtmlStylesheet)
  } else {
    document.getElementsByTagName('head')[0].appendChild(chtmlStylesheet)
  }
}

const useMathJax = (texCode, mathType = 'inline') => {
  const mathJaxElem = useRef(null)
  const { setTypesetStatus, typesetCallbacks, typesetTimer } = useContext(MathJaxContext)

  // load MathJax and trigger typesetting
  useEffect(
    () => {
      if (process.browser) {
        addToQueue(
          () => {
            setTypesetStatus(typesetStates.PENDING)
            const display = mathType === 'display'
            return new Promise((resolve, reject) => {
              window.MathJax.tex2chtmlPromise(texCode, {
                ...window.MathJax.getMetricsFor(mathJaxElem.current, display),
                display,
              }).then((mathJaxNodes) => {
                // add rendered nodes
                if (mathJaxNodes) {
                  mathJaxElem.current.innerHTML = mathJaxNodes.outerHTML
                }
              }).catch(reject).finally(resolve)
            }).finally(() => {
              if (typesetTimer.current) {
                window.clearTimeout(typesetTimer.current)
              }
              typesetTimer.current = window.setTimeout(() => {
                updateCss()
                for (let i = 0; i < typesetCallbacks.current.length; i += 1) {
                  typesetCallbacks.current[i]()
                }
                setTypesetStatus(typesetStates.DONE)
              }, TYPESETTING_DONE_TIMEOUT)
            })
          }
        )
      }
    },
    [texCode]
  )

  return { mathJaxElem }
}

export { typesetStates }
export default useMathJax
