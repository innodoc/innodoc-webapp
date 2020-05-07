import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useSelector } from 'react-redux'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

const PageTitle = ({ children }) => {
  const course = useSelector(courseSelectors.getCurrentCourse)
  const { language } = useSelector(appSelectors.getApp)
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
