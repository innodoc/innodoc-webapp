import React from 'react'

import pageSelectors from '@innodoc/client-store/src/selectors/page'

import useContentPane from '../../hooks/useContentPane'
import css from './style.sass'
import ContentFragment from './ContentFragment'

const PageContent = () => {
  const {
    content,
    fadeInClassName,
    mathJaxElem,
    title,
  } = useContentPane(pageSelectors.getCurrentPage)

  return (
    <div className={fadeInClassName} id="content">
      <h1 className={css.header}>{title}</h1>
      <div ref={mathJaxElem}>
        <ContentFragment content={content} />
      </div>
    </div>
  )
}

export default PageContent
