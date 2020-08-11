import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button, Result } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from '@innodoc/client-misc/src/i18n'

import { InternalLink } from '../content/links'
import Layout from '../Layout'
import PageTitle from '../PageTitle'

const ErrorPage = ({ statusCode }) => {
  const { t } = useTranslation()
  const course = useSelector(courseSelectors.getCurrentCourse)
  const title = t([`errorPage.${statusCode}.title`, 'errorPage.unspecific.title'])

  const resultExtra = course ? (
    <InternalLink href={course.homeLink}>
      <Button icon={<HomeOutlined />} type="primary">
        {t('errorPage.backHome')}
      </Button>
    </InternalLink>
  ) : null

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout>
        <Result
          status={statusCode.toString()}
          title={title}
          subTitle={t([`errorPage.${statusCode}.msg`, 'errorPage.unspecific.msg'])}
          extra={resultExtra}
        />
      </Layout>
    </>
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
ErrorPage.defaultProps = { statusCode: 500 }
ErrorPage.propTypes = { statusCode: PropTypes.number }

export default ErrorPage
