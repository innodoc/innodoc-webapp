import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import Drawer from 'antd/lib/drawer'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'

import Nav from './Nav'
import Logo from './Logo'
import SearchInput from './SearchInput'
import css from './style.sass'
import courseSelectors from '../../../store/selectors/course'
import { SectionLink } from '../../content/links'
import useIsNarrowerThan from '../../hooks/useIsNarrowerThan'
import { useTranslation } from '../../../lib/i18n'

const Header = () => {
  const { t } = useTranslation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isNarrowerThanMd = useIsNarrowerThan('md')
  const course = useSelector(courseSelectors.getCurrentCourse)

  const logoWrapper = course && course.homeLink
    ? (
      <SectionLink contentId={course.homeLink}>
        <a className={css.logoLink}>
          <Logo />
        </a>
      </SectionLink>
    )
    : <Logo />

  return (
    <>
      <AntLayout.Header className={css.header}>
        <Row>
          <Col xs={18} sm={20} md={8} lg={7} xl={5}>
            {logoWrapper}
          </Col>
          <Col xs={6} sm={4} md={4} lg={4} xl={3} className={css.menuRight}>
            <Button
              className={classNames(css.menuButton, css.mobileMenuButton)}
              icon="menu"
              onClick={() => setShowMobileMenu(true)}
              title={t('header.menu')}
            />
          </Col>
          <Col xs={0} sm={0} md={8} lg={9} xl={12}>
            <Nav />
          </Col>
          <Col xs={0} sm={0} md={4} lg={4} xl={4}>
            <SearchInput />
          </Col>
        </Row>
      </AntLayout.Header>
      <Drawer
        onClose={() => setShowMobileMenu(false)}
        title={t('header.menu')}
        visible={isNarrowerThanMd && showMobileMenu}
      >
        <SearchInput className={css.searchInputMenu} />
        <Nav menuMode="inline" />
      </Drawer>
    </>
  )
}

export default Header
