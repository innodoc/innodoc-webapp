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
  const logoImg = logoFilename ? (
    <div
      className={css.headerLogoImg}
      style={{ backgroundImage: `url("${staticRoot}${logoFilename}")` }}
    />
  ) : null
  return (
    <div className={css.headerLogoWrapper} title={title}>
      {logoImg}
      <span>{title}</span>
    </div>
  )
}

export default Logo
