import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Result, Row, Col } from 'antd'
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons'

import { api } from '@innodoc/misc'
import { useTranslation } from 'next-i18next'
import { userLoggedOut } from '@innodoc/store/src/actions/user'
import appSelectors from '@innodoc/store/src/selectors'
import courseSelectors from '@innodoc/store/src/selectors/course'

import getStaticPageProps from '../lib/getStaticPageProps'
import serversideBootstrap from '../lib/serversideBootstrap'
import useRequireLogin from '../../hooks/useRequireLogin'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import { ContentLink } from '../content/links'

const LogoutPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { csrfToken } = useSelector(appSelectors.getApp)
  const course = useSelector(courseSelectors.getCurrentCourse)
  const [logoutState, setLogoutState] = useState('pending')
  useRequireLogin(logoutState === 'error')
  const title = t(`user.logout.${logoutState}Message`)

  useEffect(() => {
    api
      .logoutUser(csrfToken)
      .then(() => {
        dispatch(userLoggedOut())
        setLogoutState('success')
      })
      .catch(() => setLogoutState('error'))
  }, [csrfToken, dispatch])

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={16} md={12} lg={10}>
            <Result
              icon={logoutState === 'pending' ? <LoadingOutlined /> : null}
              status={['error', 'success'].includes(logoutState) ? logoutState : 'info'}
              title={title}
              extra={
                course ? (
                  <ContentLink href={course.homeLink}>
                    <Button icon={<HomeOutlined />} type="primary">
                      {t('content.home')}
                    </Button>
                  </ContentLink>
                ) : null
              }
            />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

const getStaticProps = serversideBootstrap(getStaticPageProps)

export { getStaticProps }
export default LogoutPage
