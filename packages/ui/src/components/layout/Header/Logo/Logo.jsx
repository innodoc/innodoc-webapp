import { useSelector } from 'react-redux'

import { selectCourse } from '@innodoc/store/selectors/content'
import { useTranslatedContent } from '@innodoc/ui/hooks'

import css from './Logo.module.sss'

function Logo() {
  const translateContent = useTranslatedContent()
  const course = useSelector(selectCourse)
  const title = translateContent(course.title)

  return (
    <div className={css.headerLogoWrapper} title={title}>
      <div
        className={css.headerLogoImg}
        style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_STATIC_ROOT}${course.logo}")` }}
      />
      <span>{title}</span>
    </div>
  )
}

export default Logo
