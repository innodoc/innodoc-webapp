import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
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
import appSelectors from '../../../store/selectors/app'
import { changeLanguage } from '../../../store/actions/i18n'
import { toggleSidebar } from '../../../store/actions/ui'
import SectionLink from '../../SectionLink'

const Header = ({
  homeLink,
  languages,
  t,
  dispatchChangeLanguage,
  dispatchToggleSidebar,
  sidebarVisible,
  disableSidebar,
}) => {
  const logo = (
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
  )

  const logoWrapper = homeLink
    ? (
      <SectionLink sectionId={homeLink}>
        {logo}
      </SectionLink>
    )
    : logo

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

  const languageOptions = languages.map(lang => (
    <Menu.Item key={`language-${lang}`} onClick={() => dispatchChangeLanguage(lang)}>
      {t(`languages.${lang}`)}
    </Menu.Item>
  ))

  const languageSwitcher = (
    <Menu.SubMenu title={languageSwitcherTitle}>
      {languageOptions}
    </Menu.SubMenu>
  )

  const sidebarToggle = disableSidebar
    ? null
    : (
      <Button
        ghost
        icon="read"
        className={classNames(css.menuButton, sidebarVisible ? 'active' : null)}
        onClick={dispatchToggleSidebar}
        title={t(sidebarVisible ? 'header.hideTocLong' : 'header.showTocLong')}
      >
        {t('header.showToc')}
      </Button>
    )

  const nav = (
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
      {userMenu}
      {languageSwitcher}
    </Menu>
  )

  return (
    <AntLayout.Header className={css.header}>
      <Row>
        <Col xs={2} sm={2} md={0} lg={0} xl={0}>
          <Button icon="menu" className={css.menuButton} />
        </Col>
        <Col
          xs={{ span: 20, push: 2 }}
          sm={{ span: 13, push: 2 }}
          md={{ span: 8, push: 0 }}
          lg={{ span: 7, push: 0 }}
          xl={{ span: 5, push: 0 }}
        >
          {logoWrapper}
        </Col>
        <Col
          xs={{ span: 2, pull: 20 }}
          sm={{ span: 2, pull: 13 }}
          md={{ span: 4, pull: 0 }}
          lg={{ span: 4, pull: 0 }}
          xl={{ span: 3, pull: 0 }}
          className={css.sidebarToggle}
        >
          {sidebarToggle}
        </Col>
        <Col xs={0} sm={0} md={8} lg={9} xl={12}>
          {nav}
        </Col>
        <Col xs={0} sm={7} md={4} lg={4} xl={4}>
          <Input.Search placeholder={t('header.searchPlaceholder')} className={css.searchInput} />
        </Col>
      </Row>
    </AntLayout.Header>
  )
}

Header.propTypes = {
  homeLink: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  t: PropTypes.func.isRequired,
  dispatchChangeLanguage: PropTypes.func.isRequired,
  dispatchToggleSidebar: PropTypes.func.isRequired,
  sidebarVisible: PropTypes.bool.isRequired,
  disableSidebar: PropTypes.bool.isRequired,
}

Header.defaultProps = {
  homeLink: null,
}

const mapStateToProps = state => ({
  homeLink: appSelectors.getHomeLink(state),
  languages: appSelectors.getLanguages(state),
  sidebarVisible: appSelectors.getSidebarVisible(state),
})

const mapDispatchToProps = {
  dispatchChangeLanguage: changeLanguage,
  dispatchToggleSidebar: toggleSidebar,
}

export { Header } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(Header))
