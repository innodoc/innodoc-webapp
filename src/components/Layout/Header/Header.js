import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'

import Nav from './Nav'
import Logo from './Logo'
import { withTranslation } from '../../../lib/i18n'
import css from './style.sass'
import appSelectors from '../../../store/selectors'
import courseSelectors from '../../../store/selectors/course'
import { toggleSidebar } from '../../../store/actions/ui'
import SectionLink from '../../SectionLink'
import { courseType } from '../../../lib/propTypes'

const Header = ({
  course,
  t,
  dispatchToggleSidebar,
  sidebarVisible,
  disableSidebar,
}) => {
  const logo = <Logo />
  const logoWrapper = course && course.homeLink
    ? (
      <SectionLink sectionId={course.homeLink}>
        {logo}
      </SectionLink>
    )
    : logo

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
          <Nav />
        </Col>
        <Col xs={0} sm={7} md={4} lg={4} xl={4}>
          <Input.Search placeholder={t('header.searchPlaceholder')} className={css.searchInput} />
        </Col>
      </Row>
    </AntLayout.Header>
  )
}

Header.propTypes = {
  course: courseType,
  t: PropTypes.func.isRequired,
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Header))
