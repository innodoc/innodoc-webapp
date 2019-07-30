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
  const title = course.title[language]
  const logoFilename = course.logo
  const logoImg = logoFilename
    ? <img alt={title} src={`${staticRoot}${logoFilename}`} />
    : null
  const imgColProps = logoFilename
    ? {
      xs: 6, sm: 6, md: 8, lg: 8, xl: 8,
    }
    : {
      xs: 0, sm: 0, md: 0, lg: 0, xl: 0,
    }
  return (
    <a className={css.logoLink}>
      <Row>
        <Col className={css.headerLogoWrapper} {...imgColProps}>
          {logoImg}
        </Col>
        <Col
          xs={24 - imgColProps.xs}
          sm={24 - imgColProps.sm}
          md={24 - imgColProps.md}
          lg={24 - imgColProps.lg}
          xl={24 - imgColProps.xl}
        >
          <span>{title}</span>
        </Col>
      </Row>
    </a>
  )
}

export default Logo
