import { CommentOutlined, FilePdfOutlined, LineChartOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getApp } from '@innodoc/store/selectors/misc'
import { getCurrentPage, getNavPages } from '@innodoc/store/selectors/page'

import PageIcon from '../PageIcon.jsx'

import LinkMenuItem from './LinkMenuItem/LinkMenuItem.jsx'

function NavMenu({ menuMode }) {
  const { discourseUrl, language, pdfFilename } = useSelector(getApp)
  const currentPage = useSelector(getCurrentPage)
  const pages = useSelector(getNavPages)
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
