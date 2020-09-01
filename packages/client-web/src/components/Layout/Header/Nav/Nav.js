import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { Menu } from 'antd'
import { FilePdfOutlined, LineChartOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'
import pageSelectors from '@innodoc/client-store/src/selectors/page'

import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import css from './style.sss'
import PageIcon from '../../PageIcon'
import { PageLink } from '../../../content/links'

const Nav = ({ menuMode }) => {
  const { language, loggedInEmail } = useSelector(appSelectors.getApp)
  const currentPage = useSelector(pageSelectors.getCurrentPage)
  const pages = useSelector(pageSelectors.getNavPages)
  const { t } = useTranslation()

  const pageItems = pages.map((page) => (
    <Menu.Item key={page.id}>
      <PageLink contentId={page.id}>
        <a
          className={classNames({
            [css.active]: currentPage && page.id === currentPage.id,
          })}
          title={page.title[language]}
        >
          <PageIcon type={page.icon} />
          {page.shortTitle[language]}
        </a>
      </PageLink>
    </Menu.Item>
  ))

  return (
    <Menu mode={menuMode} selectable={false} className={css.nav}>
      {pageItems}
      <Menu.Item key="pdf">
        <a title={t('header.downloadPDFTitle')}>
          <FilePdfOutlined />
          {t('header.downloadPDF')}
        </a>
      </Menu.Item>
      <LanguageSwitcher />
      <Menu.Item key="progress">
        <Link href="/progress">
          <a>
            <LineChartOutlined />
            {t('progress.title')}
          </a>
        </Link>
      </Menu.Item>
      <UserMenu email={loggedInEmail} />
    </Menu>
  )
}

Nav.defaultProps = {
  menuMode: 'horizontal',
}

Nav.propTypes = {
  menuMode: PropTypes.string,
}

export default Nav
