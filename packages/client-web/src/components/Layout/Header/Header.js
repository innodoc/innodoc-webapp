import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import {
  Button,
  Col,
  Drawer,
  Layout as AntLayout,
  Row,
} from 'antd'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Nav from './Nav'
import Logo from './Logo'
import SearchInput from './SearchInput'
import { InternalLink } from '../../content/links'
import css from './style.sss'
import useIsNarrowerThan from '../../../hooks/useIsNarrowerThan'

const Header = () => {
  const { t } = useTranslation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isNarrowerThanMd = useIsNarrowerThan('md')
  const course = useSelector(courseSelectors.getCurrentCourse)

  const logoWrapper = course && course.homeLink
    ? (
      <InternalLink href={course.homeLink}>
        <a className={css.logoLink}>
          <Logo />
        </a>
      </InternalLink>
    )
    : <Logo />

  return (
    <>
      <AntLayout.Header className={css.header}>
        <Row>
          <Col xs={18} sm={20} md={5} lg={4} xl={3}>
            {logoWrapper}
          </Col>
          <Col xs={6} sm={4} md={0} lg={0} xl={0} className={css.menuRight}>
            <Button
              className={classNames(css.menuButton, css.mobileMenuButton)}
              icon="menu"
              onClick={() => setShowMobileMenu(true)}
              title={t('header.menu')}
            />
          </Col>
          <Col xs={0} sm={0} md={14} lg={16} xl={17}>
            <Nav />
          </Col>
          <Col xs={0} sm={0} md={5} lg={4} xl={4}>
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
