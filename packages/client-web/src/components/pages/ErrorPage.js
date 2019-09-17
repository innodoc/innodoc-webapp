import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Button from 'antd/es/button'
import Result from 'antd/es/result'

import courseSelectors from '@innodoc/client-store/src/selectors/course'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { InternalLink } from '../content/links'

import Layout from '../Layout'

const ErrorPage = ({ statusCode }) => {
  const { t } = useTranslation()
  const { homeLink } = useSelector(courseSelectors.getCurrentCourse)
  const router = useRouter()

  if (!statusCode) {
    router.replace(router.asPath)
    return null
  }

  return (
    <Layout>
      <Result
        status={statusCode.toString()}
        title={t([`errorPage.${statusCode}.title`, 'errorPage.unspecific.title'])}
        subTitle={t([`errorPage.${statusCode}.msg`, 'errorPage.unspecific.msg'])}
        extra={(
          <InternalLink href={homeLink} title="">
            <Button icon="home" type="primary">
              {t('errorPage.backHome')}
            </Button>
          </InternalLink>
        )}
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
