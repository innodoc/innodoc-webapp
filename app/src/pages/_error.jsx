import { Result } from 'antd'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

import { HomeButton, PageTitle } from '@innodoc/ui/common'
import Layout from '@innodoc/ui/layout'

function ErrorPage({ statusCode }) {
  const { t } = useTranslation()
  const title = t([`errorPage.${statusCode}.title`, 'errorPage.unspecific.title'])

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout>
        <Result
          status={statusCode.toString()}
          title={title}
          subTitle={t([`errorPage.${statusCode}.msg`, 'errorPage.unspecific.msg'])}
          extra={<HomeButton />}
        />
      </Layout>
    </>
  )
}

// TODO remove getInitialProps
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
