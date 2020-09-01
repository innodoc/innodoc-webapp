import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse, Modal, Switch, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'
import LanguageSwitcher from './LanguageSwitcher'

const stopPropagation = (checked, ev) => ev.stopPropagation()

const DataProtectionModal = ({ onAccept }) => {
  const { t } = useTranslation()
  const [dataConsent, setDataConsent] = useState(false)
  const [cookieConsent, setCookieConsent] = useState(false)
  const acceptButtonDisabled = !dataConsent || !cookieConsent

  const dataConsentSwitch = (
    <Switch onClick={stopPropagation} onChange={(state) => setDataConsent(state)} />
  )
  const cookiesConsentSwitch = (
    <Switch onClick={stopPropagation} onChange={(state) => setCookieConsent(state)} />
  )

  const footer = [
    <LanguageSwitcher key="lang-switcher" />,
    <Button disabled={acceptButtonDisabled} key="ok-btn" onClick={onAccept} type="primary">
      {t('common.ok')}
    </Button>,
  ]

  const title = (
    <>
      <InfoCircleOutlined /> {t('dataProtectionConsent.title')}
    </>
  )

  return (
    <Modal
      centered
      closable={false}
      destroyOnClose
      footer={footer}
      maskClosable={false}
      title={title}
      visible
    >
      <Typography.Paragraph>{t('dataProtectionConsent.text')}</Typography.Paragraph>
      <Collapse>
        <Collapse.Panel
          extra={dataConsentSwitch}
          header={t('dataProtectionConsent.dataProtection.title')}
          key="data"
        >
          <Typography.Text>{t('dataProtectionConsent.dataProtection.text')}</Typography.Text>
        </Collapse.Panel>
        <Collapse.Panel
          extra={cookiesConsentSwitch}
          header={t('dataProtectionConsent.cookies.title')}
          key="cookies"
        >
          <Typography.Text>{t('dataProtectionConsent.cookies.text')}</Typography.Text>
        </Collapse.Panel>
      </Collapse>
    </Modal>
  )
}

DataProtectionModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
}

export default DataProtectionModal
