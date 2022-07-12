import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button, Drawer, Grid, Layout, Menu } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from 'next-i18next'

import SecondMenu from './SecondMenu'
import NavMenu from './NavMenu'
import Logo from './Logo'
import { InternalLink } from '../../content/links'
import SearchInput from './SearchInput'
import css from './Header.module.sss'

const Header = ({ enableSearch }) => {
  const { t } = useTranslation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { md } = Grid.useBreakpoint()
  const isMobile = !md
  const course = useSelector(courseSelectors.getCurrentCourse)

  const logo =
    course && course.homeLink ? (
      <InternalLink href={course.homeLink}>
        <a className={css.logoLink}>
          <Logo />
        </a>
      </InternalLink>
    ) : (
      <Logo />
    )

  const menuMode = isMobile ? 'inline' : 'horizontal'
  const navMenu = <NavMenu menuMode={menuMode} />
  const secondMenu = <SecondMenu menuMode={menuMode} />
  const search = enableSearch ? (
    <div className={css.searchInputWrapper}>
      <SearchInput />
    </div>
  ) : null

  const drawerButton = (
    <div className={css.drawerButton}>
      <Button
        icon={<MenuOutlined />}
        onClick={() => setShowMobileMenu(true)}
        size="large"
        title={t('header.menu')}
      />
    </div>
  )

  const mobileDrawerMenu = isMobile ? (
    <Drawer
      className={css.drawerMenu}
      onClose={() => setShowMobileMenu(false)}
      title={t('header.menu')}
      visible={showMobileMenu}
    >
      {search}
      <Menu>
        <Menu.Divider />
      </Menu>
      {navMenu}
      <Menu>
        <Menu.Divider />
      </Menu>
      {secondMenu}
    </Drawer>
  ) : null

  const wideItems = isMobile ? null : (
    <>
      <div className={css.wideMenu}>
        {navMenu}
        {secondMenu}
      </div>
      {search}
    </>
  )

  return (
    <>
      <Layout.Header className={css.header}>
        {logo}
        {wideItems}
        {drawerButton}
      </Layout.Header>
      {mobileDrawerMenu}
    </>
  )
}

Header.defaultProps = {
  enableSearch: true,
}

Header.propTypes = {
  enableSearch: PropTypes.bool,
}

export default Header
