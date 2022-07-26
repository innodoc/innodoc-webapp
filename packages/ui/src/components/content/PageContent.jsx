import { Typography } from 'antd'

import { selectPage } from '@innodoc/store/selectors/pages'

import useContentPane from '../../hooks/useContentPane.js'
import PageTitle from '../common/PageTitle.jsx'
import SidebarToggleButton from '../layout/Sidebar/ToggleButton.jsx'

import css from './content.module.sss'
import ContentFragment from './ContentFragment/ContentFragment.jsx'

function PageContent() {
  const { content, fadeInClassName, title } = useContentPane(selectPage)

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
