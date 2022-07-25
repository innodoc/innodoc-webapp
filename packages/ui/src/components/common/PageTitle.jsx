import Head from 'next/head'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getCurrentCourse } from '@innodoc/store/selectors/course'
import { getApp } from '@innodoc/store/selectors/misc'

function PageTitle({ children }) {
  const course = useSelector(getCurrentCourse)
  const { language } = useSelector(getApp)
  if (!course) {
    return null
  }
  const { title } = course
  const courseTitle = title[language]
  const pageTitle = children ? `${children} · ${courseTitle}` : courseTitle

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  )
}

PageTitle.defaultProps = { children: null }
PageTitle.propTypes = { children: PropTypes.string }

export default PageTitle
