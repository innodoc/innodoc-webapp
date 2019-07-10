import React from 'react'

import useContentPane from '../hooks/useContentPane'
import css from './style.sass'
import pageSelectors from '../../store/selectors/page'
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
