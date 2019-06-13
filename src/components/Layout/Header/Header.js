import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Drawer from 'antd/lib/drawer'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import { useTranslation } from 'react-i18next'

import Nav from './Nav'
import Logo from './Logo'
import SearchInput from './SearchInput'
import css from './style.sass'
import appSelectors from '../../../store/selectors'
import courseSelectors from '../../../store/selectors/course'
import { toggleSidebar } from '../../../store/actions/ui'
import SectionLink from '../../SectionLink'
import { courseType } from '../../../lib/propTypes'
import useIsMobile from '../../../hooks/isMobile'

const Header = ({
  course,
  dispatchToggleSidebar,
  sidebarVisible,
  disableSidebar,
}) => {
  const { t } = useTranslation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isMobile = useIsMobile()

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
        ghost
        icon="read"
        className={classNames(css.menuButton, sidebarVisible ? 'active' : null)}
        onClick={dispatchToggleSidebar}
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
        visible={isMobile && showMobileMenu}
      >
        <SearchInput className={css.searchInputMenu} />
        <Nav menuMode="inline" />
      </Drawer>
    </React.Fragment>
  )
}

Header.propTypes = {
  course: courseType,
  dispatchToggleSidebar: PropTypes.func.isRequired,
  sidebarVisible: PropTypes.bool.isRequired,
  disableSidebar: PropTypes.bool.isRequired,
}

Header.defaultProps = {
  course: null,
}

const mapStateToProps = state => ({
  course: courseSelectors.getCurrentCourse(state),
  sidebarVisible: appSelectors.getApp(state).sidebarVisible,
})

const mapDispatchToProps = {
  dispatchToggleSidebar: toggleSidebar,
}

export { Header } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(Header)
