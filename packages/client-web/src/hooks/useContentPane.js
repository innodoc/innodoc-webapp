import { useEffect, useContext } from 'react'
import Router from 'next/router'
import { useSelector } from 'react-redux'
import MathJax from '@innodoc/react-mathjax-node'

import appSelectors from '@innodoc/client-store/src/selectors'

import fadeInCss from '../style/fade-in.sss'

const scrollToHash = () => {
  if (typeof window !== 'undefined') {
    Router.router.scrollToHash(Router.router.asPath)
  }
}

const useContentPane = (getCurrent) => {
  const { language } = useSelector(appSelectors.getApp)
  const current = useSelector(getCurrent)
  const loading = !language || !current || !current.content[language]
  const { addCallback, removeCallback, typesetDone } = useContext(MathJax.Context)
  const show = !loading && typesetDone
  const fadeInClassName = show ? fadeInCss.show : fadeInCss.hide
  const title = loading ? null : current.title[language]

  // Page is going to re-layout after typesetting. So, we need to manually
  // scroll to anchor.
  useEffect(() => {
    addCallback(scrollToHash)
    return () => removeCallback(scrollToHash)
  })

  return {
    id: loading ? null : current.id,
    content: loading ? [] : current.content[language],
    fadeInClassName,
    language,
    title,
    type: current && current.type,
  }
}

export { scrollToHash }
export default useContentPane
