import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Link from 'next/link'
import { withNamespaces } from 'react-i18next'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Input from 'antd/lib/input'
import Icon from 'antd/lib/icon'

import css from './style.sass'
import { changeLanguage } from '../../../store/actions/i18n'
import { toggleSidebar } from '../../../store/actions/ui'

const Header = ({ t, dispatchChangeLanguage, dispatchToggleSidebar }) => {
  const logo = (
    <Link href="/">
      <a className={css.logoLink}>
        <Row>
          <Col xs={6} sm={6} md={8} lg={8} xl={8} className={css.headerLogoWrapper}>
            <img
              alt={t('header.tmpTitle')}
              src="/static/img/m4r-logo-simple.png"
            />
          </Col>
          <Col xs={18} sm={18} md={16} lg={16} xl={16}>
            <span className={css.headerTitle}>
              {t('header.tmpTitle')}
            </span>
          </Col>
        </Row>
      </a>
    </Link>
  )

  const userMenuTitle = (
    <span>
      <Icon type="user" />
      <span>
        {t('header.login')}
      </span>
    </span>
  )

  const userMenu = (
    <Menu.SubMenu title={userMenuTitle}>
      <Menu.Item key="login">
        <Icon type="login" />
        <span>
          {t('header.login')}
        </span>
      </Menu.Item>
      <Menu.Item key="register">
        <Icon type="user-add" />
        <span>
          {t('header.createAccount')}
        </span>
      </Menu.Item>
    </Menu.SubMenu>
  )

  const languageSwitcherTitle = (
    <span>
      <Icon type="global" />
      <span>
        {t('header.language')}
      </span>
    </span>
  )

  // TODO: get languages from store
  const languageOptions = ['de', 'en'].map(lang => (
    <Menu.Item key={`language-${lang}`}>
      {t(`languages.${lang}`)}
    </Menu.Item>
  ))

  const languageSwitcher = (
    <Menu.SubMenu title={languageSwitcherTitle}>
      {languageOptions}
    </Menu.SubMenu>
  )

  const nav = (
    <Menu mode="horizontal" className={css.nav}>
      <Menu.Item>
        <a title={t('header.showTOC')}>
          <Icon type="read" />
          {t('header.showTOC')}
        </a>
      </Menu.Item>
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
      {userMenu}
      {languageSwitcher}
    </Menu>
  )

  return (
    <AntLayout.Header className={css.header}>
      <Row>
        <Col xs={2} sm={1} md={0} lg={0} xl={0}>
          <Button icon="menu" className={css.menuButton} />
        </Col>
        <Col xs={22} sm={23} md={8} lg={7} xl={5}>
          {logo}
        </Col>
        <Col xs={0} sm={0} md={11} lg={13} xl={14}>
          {nav}
        </Col>
        <Col xs={0} sm={0} md={5} lg={4} xl={5}>
          <Input.Search placeholder={t('header.searchPlaceholder')} className={css.searchInput} />
        </Col>
      </Row>
    </AntLayout.Header>
  )
}

Header.propTypes = {
  t: PropTypes.func.isRequired,
  dispatchChangeLanguage: PropTypes.func.isRequired,
  dispatchToggleSidebar: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  dispatchChangeLanguage: changeLanguage,
  dispatchToggleSidebar: toggleSidebar,
}

export { Header } // for testing
export default connect(null, mapDispatchToProps)(withNamespaces()(Header))
