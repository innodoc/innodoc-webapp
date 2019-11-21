import Router from 'next/router'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import appSelectors from '@innodoc/client-store/src/selectors'

import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'

const scrollToHash = () => {
  if (process.browser) {
    Router.router.scrollToHash(Router.router.asPath)
  }
}

const useContentPane = (getCurrent, show) => {
  const { language } = useSelector(appSelectors.getApp)
  const current = useSelector(getCurrent)
  const loading = !language || !current || !current.content[language]

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
