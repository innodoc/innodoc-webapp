import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'
import pageSelectors from '@innodoc/client-store/src/selectors/page'

import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import css from './style.sass'
import { PageLink } from '../../../content/links'

const Nav = ({ menuMode }) => {
  const { language } = useSelector(appSelectors.getApp)
  const currentPage = useSelector(pageSelectors.getCurrentPage)
  const pages = useSelector(pageSelectors.getNavPages)
  const { t } = useTranslation()
  const pageItems = pages
    .map((page) => (
      <Menu.Item key={page.id}>
        <PageLink contentId={page.id}>
          <a
            className={
              classNames({ [css.active]: currentPage && page.id === currentPage.id })
            }
            title={page.title[language]}
          >
            {page.icon ? <Icon type={page.icon} /> : null}
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
          <Icon type="file-pdf" />
          {t('header.downloadPDF')}
        </a>
      </Menu.Item>
      <LanguageSwitcher />
      <UserMenu />
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
