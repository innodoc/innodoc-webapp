import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Button, Result } from 'antd'

import courseSelectors from '@innodoc/client-store/src/selectors/course'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { InternalLink } from '../content/links'

import Layout from '../Layout'

const ErrorPage = ({ statusCode }) => {
  const { t } = useTranslation()
  const course = useSelector(courseSelectors.getCurrentCourse)
  const router = useRouter()

  if (!statusCode) {
    router.replace(router.asPath)
    return null
  }

  const resultExtra = course
    ? (
      <InternalLink href={course.homeLink} title="">
        <Button icon="home" type="primary">
          {t('errorPage.backHome')}
        </Button>
      </InternalLink>
    )
    : null

  return (
    <Layout>
      <Result
        status={statusCode.toString()}
        title={t([`errorPage.${statusCode}.title`, 'errorPage.unspecific.title'])}
        subTitle={t([`errorPage.${statusCode}.msg`, 'errorPage.unspecific.msg'])}
        extra={resultExtra}
      />
    </Layout>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  if (res) {
    return { statusCode: res.statusCode }
  }
  if (err) {
    return { statusCode: err.statusCode }
  }
  return {}
}
ErrorPage.defaultProps = { statusCode: null }
ErrorPage.propTypes = { statusCode: PropTypes.number }

export default ErrorPage
