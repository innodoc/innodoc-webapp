import Router from 'next/router'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import appSelectors from '@innodoc/client-store/src/selectors'

import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'
// import { typesetStates, useMathJaxScanElement } from './useMathJax'

const scrollToHash = () => {
  if (process.browser) {
    Router.router.scrollToHash(Router.router.asPath)
  }
}

const useContentPane = (getCurrent) => {
  const { language } = useSelector(appSelectors.getApp)
  const current = useSelector(getCurrent)
  const loading = !language || !current || !current.content[language]
  // const { mathJaxElem, typesetState } = useMathJaxScanElement([language, current], scrollToHash)

  // const show = !loading && [typesetStates.SUCCESS, typesetStates.ERROR].includes(typesetState)
  const title = loading ? null : current.title[language]
  // const fadeInClassName = classNames({
  //   [fadeInCss.show]: show,
  //   [fadeInCss.hide]: !show,
  // })
  const fadeInClassName = classNames({
    [fadeInCss.show]: true,
    [fadeInCss.hide]: false,
  })
  return {
    content: loading ? [] : current.content[language],
    fadeInClassName,
    language,
    // mathJaxElem,
    title,
  }
}

export { scrollToHash }
export default useContentPane
