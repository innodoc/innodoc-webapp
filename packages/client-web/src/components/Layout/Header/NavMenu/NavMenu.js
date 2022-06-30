import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Menu } from 'antd'
import { CommentOutlined, FilePdfOutlined, LineChartOutlined } from '@ant-design/icons'

import { useTranslation } from 'next-i18next'
import appSelectors from '@innodoc/client-store/src/selectors'
import pageSelectors from '@innodoc/client-store/src/selectors/page'

import PageIcon from '../../PageIcon'
import LinkMenuItem from '../LinkMenuItem'

const NavMenu = ({ menuMode }) => {
  const { discourseUrl, language, pdfFilename } = useSelector(appSelectors.getApp)
  const currentPage = useSelector(pageSelectors.getCurrentPage)
  const pages = useSelector(pageSelectors.getNavPages)
  const router = useRouter()
  const { t } = useTranslation()

  const pageItems = pages.map((page) => (
    <LinkMenuItem
      icon={<PageIcon type={page.icon} />}
      itemActive={currentPage && page.id === currentPage.id}
      key={page.id}
      pageId={page.id}
      title={page.shortTitle[language]}
      titleLong={page.title[language]}
    />
  ))

  const pdfLinkItem = pdfFilename ? (
    <Menu.Item key="pdf">
      <a href={`/${pdfFilename}`} title={t('header.downloadPDFTitle')}>
        <FilePdfOutlined />
        {t('header.downloadPDF')}
      </a>
    </Menu.Item>
  ) : null

  let discourseLinkItem
  if (discourseUrl) {
    const url = new URL(discourseUrl)
    url.pathname = '/session/sso'
    discourseLinkItem = (
      <Menu.Item key="forum">
        <a href={url} title={t('header.forumTitle')}>
          <CommentOutlined />
          {t('header.forum')}
        </a>
      </Menu.Item>
    )
  }

  return (
    <Menu mode={menuMode} selectable={false}>
      {pageItems}
      <LinkMenuItem
        itemActive={router.pathname === '/progress'}
        href="/progress"
        icon={<LineChartOutlined />}
        title={t('progress.title')}
        titleLong={t('progress.titleLong')}
      />
      {pdfLinkItem}
      {discourseLinkItem}
    </Menu>
  )
}

NavMenu.propTypes = {
  menuMode: PropTypes.string.isRequired,
}

export default NavMenu
