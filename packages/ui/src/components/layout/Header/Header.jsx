import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Grid, Layout, Menu } from 'antd'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { getCurrentCourse } from '@innodoc/store/selectors/course'

import ContentLink from '../../content/links/ContentLink.jsx'

import css from './Header.module.sss'
import Logo from './Logo/Logo.jsx'
import NavMenu from './NavMenu.jsx'
import SearchInput from './SearchInput.jsx'
import SecondMenu from './SecondMenu/SecondMenu.jsx'

function Header({ enableSearch }) {
  const { t } = useTranslation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { md } = Grid.useBreakpoint()
  const isMobile = !md
  const course = useSelector(getCurrentCourse)

  const logo =
    course && course.homeLink ? (
      <ContentLink href={course.homeLink}>
        <a className={css.logoLink}>
          <Logo />
        </a>
      </ContentLink>
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
