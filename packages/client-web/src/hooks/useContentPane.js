import { useEffect, useContext } from 'react'
import Router from 'next/router'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import appSelectors from '@innodoc/client-store/src/selectors'

import fadeInCss from '../style/fade-in.sss'
import typesetStates from './mathjax/states'
import MathJaxContext from '../mathjax/MathJaxContext'

const scrollToHash = () => {
  if (process.browser) {
    Router.router.scrollToHash(Router.router.asPath)
  }
}

const useContentPane = (getCurrent) => {
  const { language } = useSelector(appSelectors.getApp)
  const current = useSelector(getCurrent)
  const loading = !language || !current || !current.content[language]
  const { addCallback, removeCallback, typesetStatus } = useContext(MathJaxContext)
  const typesetDone = typesetStatus === typesetStates.DONE
  const show = !loading && typesetDone

  // Page is going to relayout after typesetting. So, we need to scroll todo
  // anchor afterwards.
  useEffect(() => {
    addCallback(scrollToHash)
    return () => removeCallback(scrollToHash)
  })

  const title = loading ? null : current.title[language]
  const fadeInClassName = classNames({
    [fadeInCss.show]: show,
    [fadeInCss.hide]: !show,
  })
  return {
    content: loading ? [] : current.content[language],
    fadeInClassName,
    language,
    title,
  }
}

export { scrollToHash }
export default useContentPane
