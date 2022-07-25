import { BarsOutlined, ReadOutlined } from '@ant-design/icons'
import { Col, Layout as AntLayout, List, Typography, Row } from 'antd'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

import { getCurrentCourse } from '@innodoc/store/selectors/course'
import { getFooterA, getFooterB } from '@innodoc/store/selectors/fragment'
import { getApp } from '@innodoc/store/selectors/misc'
import { getCurrentPage, getFooterPages } from '@innodoc/store/selectors/page'

import ContentFragment from '../../content/ContentFragment/ContentFragment.jsx'
import PageLink from '../../content/links/PageLink.js'
import PageIcon from '../PageIcon.jsx'

import css from './Footer.module.sss'
import FooterLink from './FooterLink/FooterLink.jsx'

function Footer() {
  const { t } = useTranslation()
  const router = useRouter()
  const { language } = useSelector(getApp)
  const course = useSelector(getCurrentCourse)
  const currentPage = useSelector(getCurrentPage)
  const pages = useSelector(getFooterPages)
  const footerA = useSelector(getFooterA)
  const footerB = useSelector(getFooterB)
  const title = course ? course.title[language] : ''

  const customPageItems = pages.map((page) => (
    <FooterLink
      active={currentPage && page.id === currentPage.id}
      icon={page.icon ? <PageIcon type={page.icon} /> : null}
      key={page.id}
      renderLink={() => <PageLink contentId={page.id} />}
      shortTitle={page.shortTitle[language]}
      title={page.title[language] || ''}
    />
  ))

  const otherPageItems = [
    ['/toc', 'common.toc', ReadOutlined],
    ['/index-page', 'index.title', BarsOutlined],
  ].map(([href, translateKey, Icon]) => (
    <FooterLink
      active={router.asPath === href}
      icon={<Icon />}
      key={href}
      renderLink={() => (
        <Link href={href}>
          <a> </a>
        </Link>
      )}
      title={t(translateKey)}
    />
  ))

  const footerAContent =
    footerA && footerA.content[language] ? (
      <ContentFragment content={footerA.content[language]} />
    ) : null
  const footerBContent =
    footerB && footerB.content[language] ? (
      <ContentFragment content={footerB.content[language]} />
    ) : null

  return (
    <AntLayout.Footer className={css.footer}>
      <Row>
        <Col xs={24} sm={24} md={6} lg={6} xl={6} className={css.footerCol}>
          <div className={css.footerSegment}>
            <Typography.Title level={4}>{title}</Typography.Title>
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
