import { useSelector } from 'react-redux'

import { getApp } from '@innodoc/store/selectors/misc'
import { getCurrentCourse } from '@innodoc/store/selectors/course'

import css from './Logo.module.sss'

function Logo() {
  const { language, staticRoot } = useSelector(getApp)
  const course = useSelector(getCurrentCourse)
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
