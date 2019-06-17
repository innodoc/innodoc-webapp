import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'
import Link from 'next/link'

import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import css from './style.sass'
import { useTranslation } from '../../../../lib/i18n'

const Nav = ({ menuMode }) => {
  const { t } = useTranslation()
  return (
    <Menu mode={menuMode} selectable={false} className={css.nav}>
      <Menu.Item key="about">
        <Link href="/about">
          <a title={t('header.aboutTheCourse')}>
            <Icon type="info-circle" />
            {t('header.about')}
          </a>
        </Link>
      </Menu.Item>
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
