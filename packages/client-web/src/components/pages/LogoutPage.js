import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Result, Row, Col } from 'antd'
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons'

import { logoutUser } from '@innodoc/client-misc/src/api'
import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { userLoggedOut } from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import Layout from '../Layout'
import { InternalLink } from '../content/links'

const LogoutPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { appRoot, csrfToken } = useSelector(appSelectors.getApp)
  const course = useSelector(courseSelectors.getCurrentCourse)
  const [logoutState, setLogoutState] = useState('pending')

  useEffect(() => {
    logoutUser(appRoot, csrfToken)
      .then(() => {
        dispatch(userLoggedOut())
        setLogoutState('success')
      })
      .catch(() => setLogoutState('error'))
  }, [appRoot, csrfToken, dispatch])

  return (
    <Layout disableSidebar>
      <Row justify="space-around" align="middle">
        <Col xs={24} sm={16} md={12} lg={10}>
          <Result
            icon={logoutState === 'pending' ? <LoadingOutlined /> : null}
            status={
              ['error', 'success'].includes(logoutState) ? logoutState : 'info'
            }
            title={t(`user.logout.${logoutState}Message`)}
            extra={
              course ? (
                <InternalLink href={course.homeLink}>
                  <Button icon={<HomeOutlined />} type="primary">
                    {t('content.home')}
                  </Button>
                </InternalLink>
              ) : null
            }
          />
        </Col>
      </Row>
    </Layout>
  )
}

export default LogoutPage
