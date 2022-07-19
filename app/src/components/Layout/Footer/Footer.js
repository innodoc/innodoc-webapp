import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Col, Layout as AntLayout, List, Typography, Row } from 'antd'
import { BarsOutlined, ReadOutlined } from '@ant-design/icons'

import appSelectors from '@innodoc/store/src/selectors'
import courseSelectors from '@innodoc/store/src/selectors/course'
import fragmentSelectors from '@innodoc/store/src/selectors/fragment'
import pageSelectors from '@innodoc/store/src/selectors/page'

import { useTranslation } from 'next-i18next'

import FooterLink from './Link'
import { PageLink } from '../../content/links'
import ContentFragment from '../../content/ContentFragment'
import PageIcon from '../PageIcon'
import css from './Footer.module.sss'

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
