import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Modal, Result } from 'antd'
import { useTranslation } from 'next-i18next'

import { propTypes } from '@innodoc/client-misc'

const MessageModal = ({ message: { closable, level, text, type }, onClose }) => {
  const { t } = useTranslation()

  const footer = closable
    ? [
        <Button key="ok" onClick={onClose} type="primary">
          {t('common.ok')}
        </Button>,
      ]
    : null

  const subTitle = (
    <>
      {t(`userMessage.types.${type}.text`)}
      {text ? <Input.TextArea disabled value={text} /> : null}
    </>
  )

  return (
    <Modal
      centered
      closable={closable}
      destroyOnClose
      footer={footer}
      maskClosable={false}
      onCancel={onClose}
      title={t(`userMessage.levels.${level}`)}
      visible
    >
      <Result status={level} title={t(`userMessage.types.${type}.title`)} subTitle={subTitle} />
    </Modal>
  )
}

MessageModal.propTypes = {
  message: propTypes.messageType.isRequired,
  onClose: PropTypes.func,
}

MessageModal.defaultProps = {
  onClose: () => {},
}

export default MessageModal
