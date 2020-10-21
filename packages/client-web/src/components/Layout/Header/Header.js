import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Drawer, Grid, Layout, Menu } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from '@innodoc/common/src/i18n'

import SecondMenu from './SecondMenu'
import NavMenu from './NavMenu'
import Logo from './Logo'
import { InternalLink } from '../../content/links'
import SearchInput from './SearchInput'
import css from './style.sss'

const Header = () => {
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
  const search = (
    <div className={css.searchInputWrapper}>
      <SearchInput />
    </div>
  )

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

export default Header
