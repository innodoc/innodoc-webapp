import React from 'react'

import pageSelectors from '@innodoc/client-store/src/selectors/page'

import useContentPane from '../../hooks/useContentPane'
import ContentFragment from './ContentFragment'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'
import css from './style.sss'

const PageContent = () => {
  const { content, fadeInClassName, title } = useContentPane(pageSelectors.getCurrentPage)
  return (
    <div className={fadeInClassName} id="content">
      <div className={css.sidebarToggle}>
        <SidebarToggleButton />
      </div>
      <h1 className={css.header}>{title}</h1>
      <ContentFragment content={content} />
    </div>
  )
}

export default PageContent
