import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import AntLayout from 'antd/lib/layout'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import List from 'antd/lib/list'

import { PageLink } from '../../content/links'
import ContentFragment from '../../content/ContentFragment'
import css from './style.sass'
import appSelectors from '../../../store/selectors'
import courseSelectors from '../../../store/selectors/course'
import fragmentSelectors from '../../../store/selectors/fragment'
import pageSelectors from '../../../store/selectors/page'

const Footer = () => {
  const { language } = useSelector(appSelectors.getApp)
  const course = useSelector(courseSelectors.getCurrentCourse)
  const currentPage = useSelector(pageSelectors.getCurrentPage)
  const pages = useSelector(pageSelectors.getFooterPages)
  const footerA = useSelector(fragmentSelectors.getFooterA)
  const footerB = useSelector(fragmentSelectors.getFooterB)
  const title = course ? course.title[language] : ''

  const pageItems = pages
    .map((page) => (
      <List.Item key={page.id}>
        <PageLink contentId={page.id}>
          <a
            className={classNames(css.pageLink, {
              [css.active]: currentPage && page.id === currentPage.id,
            })}
            title={page.title[language]}
          >
            {
              page.icon
                ? <Icon type={page.icon} />
                : <Icon type="border" className={css.iconPlaceholder} />
            }
            <span>{page.shortTitle[language]}</span>
          </a>
        </PageLink>
      </List.Item>
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
            <List>{pageItems}</List>
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
