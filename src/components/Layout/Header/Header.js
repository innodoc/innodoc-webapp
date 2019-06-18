import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
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
import appSelectors from '../../../store/selectors'
import courseSelectors from '../../../store/selectors/course'
import { toggleSidebar } from '../../../store/actions/ui'
import SectionLink from '../../SectionLink'
import useIsNarrowerThan from '../../../hooks/useIsNarrowerThan'
import { useTranslation } from '../../../lib/i18n'

const Header = ({ disableSidebar }) => {
  const { t } = useTranslation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isNarrowerThanMd = useIsNarrowerThan('md')
  const course = useSelector(courseSelectors.getCurrentCourse)
  const { sidebarVisible } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()

  const logoWrapper = course && course.homeLink
    ? (
      <SectionLink sectionId={course.homeLink}>
        <Logo />
      </SectionLink>
    )
    : <Logo />

  const sidebarToggle = disableSidebar
    ? null
    : (
      <Button
        className={classNames(css.menuButton, sidebarVisible ? 'active' : null)}
        ghost
        icon="read"
        onClick={() => dispatch(toggleSidebar())}
        title={t(sidebarVisible ? 'header.hideTocLong' : 'header.showTocLong')}
      >
        {t('header.showToc')}
      </Button>
    )

  return (
    <React.Fragment>
      <AntLayout.Header className={css.header}>
        <Row>
          <Col xs={18} sm={20} md={8} lg={7} xl={5}>
            {logoWrapper}
          </Col>
          <Col xs={6} sm={4} md={4} lg={4} xl={3} className={css.menuRight}>
            {sidebarToggle}
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
    </React.Fragment>
  )
}

Header.propTypes = {
  disableSidebar: PropTypes.bool.isRequired,
}

export default Header
