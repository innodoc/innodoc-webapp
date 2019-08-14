import React from 'react'
import { useSelector } from 'react-redux'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

import css from './style.sass'
import appSelectors from '../../../../store/selectors'
import courseSelectors from '../../../../store/selectors/course'

const Logo = () => {
  const { language, staticRoot } = useSelector(appSelectors.getApp)
  const course = useSelector(courseSelectors.getCurrentCourse)
  const title = course ? course.title[language] : ''
  const logoFilename = course ? course.logo : ''
  const logoImg = logoFilename
    ? <img alt={title} src={`${staticRoot}${logoFilename}`} />
    : null
  const xs = logoFilename ? 6 : 0
  const sm = logoFilename ? 6 : 0
  const md = logoFilename ? 8 : 0
  const lg = logoFilename ? 8 : 0
  const xl = logoFilename ? 8 : 0
  return (
    <a className={css.logoLink}>
      <Row>
        <Col
          className={css.headerLogoWrapper}
          xs={xs}
          sm={sm}
          md={md}
          lg={lg}
          xl={xl}
        >
          {logoImg}
        </Col>
        <Col
          xs={24 - xs}
          sm={24 - sm}
          md={24 - md}
          lg={24 - lg}
          xl={24 - xl}
        >
          <span>{title}</span>
        </Col>
      </Row>
    </a>
  )
}

export default Logo
