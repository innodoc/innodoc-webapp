import React from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Col,
  Layout as AntLayout,
  List,
  Row,
} from 'antd'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import fragmentSelectors from '@innodoc/client-store/src/selectors/fragment'
import pageSelectors from '@innodoc/client-store/src/selectors/page'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import FooterLink from './Link'
import { PageLink } from '../../content/links'
import ContentFragment from '../../content/ContentFragment'
import css from './style.sss'

const Footer = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { language } = useSelector(appSelectors.getApp)
  const course = useSelector(courseSelectors.getCurrentCourse)
  const currentPage = useSelector(pageSelectors.getCurrentPage)
  const pages = useSelector(pageSelectors.getFooterPages)
  const footerA = useSelector(fragmentSelectors.getFooterA)
  const footerB = useSelector(fragmentSelectors.getFooterB)
  const title = course ? course.title[language] : ''

  const customPageItems = pages.map(
    (page) => (
      <FooterLink
        active={currentPage && page.id === currentPage.id}
        iconType={page.icon}
        key={page.id}
        renderLink={() => <PageLink contentId={page.id} />}
        shortTitle={page.shortTitle[language]}
        title={page.title[language] || ''}
      />
    )
  )

  const otherPageItems = [
    ['/toc', 'common.toc', 'read'],
    ['/index-page', 'common.index', 'bars'],
  ].map(([href, translateKey, iconType]) => (
    <FooterLink
      active={router.asPath === href}
      iconType={iconType}
      key={href}
      renderLink={() => <Link href={href}><a> </a></Link>}
      title={t(translateKey)}
    />
  ))

  const footerAContent = footerA && footerA.content[language]
    ? <ContentFragment content={footerA.content[language]} />
    : null
  const footerBContent = footerB && footerB.content[language]
    ? <ContentFragment content={footerB.content[language]} />
    : null

  return (
    <AntLayout.Footer className={css.footer}>
      <Row>
        <Col xs={24} sm={24} md={6} lg={6} xl={6} className={css.footerCol}>
          <div className={css.footerSegment}>
            <h4>{title}</h4>
            <List>{customPageItems}</List>
            <List>{otherPageItems}</List>
          </div>
        </Col>
        <Col xs={24} sm={24} md={11} lg={11} xl={11} className={css.footerCol}>
          <div className={css.footerSegment}>{footerAContent}</div>
        </Col>
        <Col xs={24} sm={24} md={7} lg={7} xl={7} className={css.footerCol}>
          <div className={css.footerSegment}>{footerBContent}</div>
        </Col>
      </Row>
    </AntLayout.Footer>
  )
}

export default Footer
