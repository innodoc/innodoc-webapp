import React from 'react'
import { useSelector } from 'react-redux'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import css from './style.sss'

const Logo = () => {
  const { language, staticRoot } = useSelector(appSelectors.getApp)
  const course = useSelector(courseSelectors.getCurrentCourse)
  const title = course ? course.title[language] : ''
  const logoFilename = course ? course.logo : ''
  const logoImg = logoFilename
    ? <img alt={title} src={`${staticRoot}${logoFilename}`} />
    : null
  return (
    <div className={css.headerLogoWrapper}>
      {logoImg}
      <span>{title}</span>
    </div>
  )
}

export default Logo
