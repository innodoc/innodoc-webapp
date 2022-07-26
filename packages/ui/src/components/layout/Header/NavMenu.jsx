import { CommentOutlined, FilePdfOutlined, LineChartOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { selectPage, selectNavPages } from '@innodoc/store/selectors/pages'
import { useTranslatedContent } from '@innodoc/ui/hooks'

import PageIcon from '../PageIcon.jsx'

import LinkMenuItem from './LinkMenuItem/LinkMenuItem.jsx'

function NavMenu({ menuMode }) {
  const { t } = useTranslation()
  const translateContent = useTranslatedContent()

  const currentPage = useSelector(selectPage)
  const pages = useSelector(selectNavPages)
  const router = useRouter()

  const pageItems = pages.map((page) => (
    <LinkMenuItem
      icon={<PageIcon type={page.icon} />}
      itemActive={currentPage && page.id === currentPage.id}
      key={page.id}
      pageId={page.id}
      title={translateContent(page.shortTitle)}
      titleLong={translateContent(page.title)}
    />
  ))

  const pdfLinkItem = process.env.NEXT_PUBLIC_PDF_FILE ? (
    <Menu.Item key="pdf">
      <a href={`/${process.env.NEXT_PUBLIC_PDF_FILE}`} title={t('header.downloadPDFTitle')}>
        <FilePdfOutlined />
        {t('header.downloadPDF')}
      </a>
    </Menu.Item>
  ) : null

  let discourseLinkItem
  if (process.env.NEXT_PUBLIC_DISCOURSE_URL) {
    const url = new URL(process.env.NEXT_PUBLIC_DISCOURSE_URL)
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
