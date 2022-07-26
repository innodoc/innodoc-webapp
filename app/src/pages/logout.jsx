import { HomeOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, Result, Row, Col } from 'antd'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { logoutUser } from '@innodoc/misc/api'
import { userLoggedOut } from '@innodoc/store/actions/user'
import { getApp } from '@innodoc/store/selectors/misc'
import { getCurrentCourse } from '@innodoc/store/selectors/course'

import PageTitle from '../common/PageTitle'
import { ContentLink } from '../content/links'
import Layout from '../Layout'
import getTranslationProps from '../lib/getTranslationProps.js'
import serversideBootstrap from '../lib/serversideBootstrap.js'
import useRequireLogin from '../../hooks/useRequireLogin'

function Logout() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { csrfToken } = useSelector(getApp)
  const course = useSelector(getCurrentCourse)
  const [logoutState, setLogoutState] = useState('pending')
  useRequireLogin(logoutState === 'error')
  const title = t(`user.logout.${logoutState}Message`)

  useEffect(() => {
    logoutUser(csrfToken)
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

const getStaticProps = serversideBootstrap(getTranslationProps)

export { getStaticProps }
export default Logout
