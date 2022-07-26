import { BarsOutlined, ReadOutlined } from '@ant-design/icons'
import { Col, Layout as AntLayout, List, Typography, Row } from 'antd'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

import { selectCourse, selectFooterA, selectFooterB } from '@innodoc/store/selectors/content'
import { selectPage, selectFooterPages } from '@innodoc/store/selectors/pages'
import { useTranslatedContent } from '@innodoc/ui/hooks'

import ContentFragment from '../../content/ContentFragment/ContentFragment.jsx'
import PageLink from '../../content/links/PageLink.js'
import PageIcon from '../PageIcon.jsx'

import css from './Footer.module.sss'
import FooterLink from './FooterLink/FooterLink.jsx'

function Footer() {
  const router = useRouter()
  const { t } = useTranslation()

  const translateContent = useTranslatedContent()

  const { title } = useSelector(selectCourse)
  const currentPage = useSelector(selectPage)
  const pages = useSelector(selectFooterPages)
  const footerA = useSelector(selectFooterA)
  const footerB = useSelector(selectFooterB)

  const customPageItems = pages.map((page) => (
    <FooterLink
      active={currentPage && page.id === currentPage.id}
      icon={page.icon ? <PageIcon type={page.icon} /> : null}
      key={page.id}
      renderLink={() => <PageLink contentId={page.id} />}
      shortTitle={translateContent(page.shortTitle)}
      title={translateContent(page.title)}
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

  const footerAContent = footerA?.content ? (
    <ContentFragment content={translateContent(footerA?.content)} />
  ) : null
  const footerBContent = footerB?.content ? (
    <ContentFragment content={translateContent(footerB?.content)} />
  ) : null

  return (
    <AntLayout.Footer className={css.footer}>
      <Row>
        <Col xs={24} sm={24} md={6} lg={6} xl={6} className={css.footerCol}>
          <div className={css.footerSegment}>
            <Typography.Title level={4}>{translateContent(title)}</Typography.Title>
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
