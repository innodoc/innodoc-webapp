import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'
import Link from 'next/link'

import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import { withTranslation } from '../../../../lib/i18n'
import css from './style.sass'

const Nav = ({ t }) => (
  <Menu mode="horizontal" selectable={false} className={css.nav}>
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
    <LanguageSwitcher t={t} />
    <UserMenu t={t} />
  </Menu>
)

Nav.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withTranslation()(Nav)
