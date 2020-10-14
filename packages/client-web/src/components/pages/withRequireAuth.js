import React from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import appSelectors from '@innodoc/client-store/src/selectors'
import { useTranslation } from '@innodoc/common/src/i18n'

import HomeButton from '../HomeButton'
import LoginButton from '../LoginButton'

const withRequireAuth = (WrappedComponent) => {
  const WithHoc = (props) => {
    const { t } = useTranslation()
    const { loggedInEmail } = useSelector(appSelectors.getApp)

    if (!loggedInEmail) {
      const title = (
        <>
          <ExclamationCircleOutlined /> {t('withRequireAuth.title')}
        </>
      )
      return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <WrappedComponent {...props}>
          <Modal
            centered
            closable={false}
            footer={[<LoginButton key="login" />, <HomeButton key="home" />]}
            maskClosable={false}
            title={title}
            visible
          >
            {t('withRequireAuth.text')}
          </Modal>
        </WrappedComponent>
      )
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <WrappedComponent {...props} />
  }

  const wrappedDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithHoc.displayName = `withRequireAuth(${wrappedDisplayName})`

  return WithHoc
}

export default withRequireAuth
