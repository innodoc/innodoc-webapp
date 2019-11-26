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

const useMathJax = (texCode, mathType = 'inline', onTypesettingDone) => {
  const mathJaxElem = useRef(null)
  const { setTypesetStatus, typesetTimer } = useContext(MathJaxContext)

  // load MathJax and trigger typesetting
  useEffect(
    () => {
      if (process.browser) {
        console.log('adding to queue')
        addToQueue(
          () => {
            console.log('useEffect', mathJaxElem.current)

            setTypesetStatus(typesetStates.PENDING)
            const display = mathType === 'display'
            const metrics = window.MathJax.getMetricsFor(mathJaxElem.current, display)

            return window.MathJax
              .tex2chtmlPromise(texCode, { ...metrics, display })
              .then((mathJaxNodes) => {
                console.log('render node')
                // add rendered nodes
                if (mathJaxNodes) {
                  mathJaxElem.current.innerHTML = mathJaxNodes.outerHTML
                }
              })
              .finally(() => {
                if (typesetTimer.current) {
                  window.clearTimeout(typesetTimer.current)
                }
                typesetTimer.current = window.setTimeout(() => {
                  console.log('Timeout')
                  updateCss()
                  setTypesetStatus(typesetStates.DONE)
                  if (onTypesettingDone) {
                    onTypesettingDone()
                  }
                }, TYPESETTING_DONE_TIMEOUT)
              })
              .catch((err) => {
                console.log(`Typeset error with '${texCode}' display=${display}`)
                console.log(mathJaxElem.current)
                console.log(metrics)
                console.log(err)
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
