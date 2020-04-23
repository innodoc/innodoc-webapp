import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useSelector } from 'react-redux'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

const PageTitle = ({ children }) => {
  const { title } = useSelector(courseSelectors.getCurrentCourse)
  const { language } = useSelector(appSelectors.getApp)
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
