import React from 'react'
import { Typography } from 'antd'

import pageSelectors from '@innodoc/client-store/src/selectors/page'

import useContentPane from '../../hooks/useContentPane'
import PageTitle from '../common/PageTitle'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'
import ContentFragment from './ContentFragment'
import css from './content.module.sss'

const PageContent = () => {
  const { content, fadeInClassName, title } = useContentPane(pageSelectors.getCurrentPage)
  console.log('PageContent content=')
  console.log(content)

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <div className={fadeInClassName} id="content">
        <div className={css.sidebarToggle}>
          <SidebarToggleButton />
        </div>
        <Typography.Title>{title}</Typography.Title>
        <ContentFragment content={content} />
      </div>
    </>
  )
}

export default PageContent
