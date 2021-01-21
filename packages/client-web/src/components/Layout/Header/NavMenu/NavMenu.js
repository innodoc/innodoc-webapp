import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Menu } from 'antd'
import { FilePdfOutlined, LineChartOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'
import pageSelectors from '@innodoc/client-store/src/selectors/page'

import PageIcon from '../../PageIcon'
import LinkMenuItem from '../LinkMenuItem'

const NavMenu = ({ menuMode }) => {
  const { language, pdfFilename } = useSelector(appSelectors.getApp)
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
    </Menu>
  )
}

NavMenu.propTypes = {
  menuMode: PropTypes.string.isRequired,
}

export default NavMenu
