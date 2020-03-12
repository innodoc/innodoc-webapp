import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Modal, Result } from 'antd'

import { messageType } from '@innodoc/client-misc/src/propTypes'
import { useTranslation } from '@innodoc/client-misc/src/i18n'

const MessageModal = ({
  message: { closable, level, text, type },
  onClose,
}) => {
  const { t } = useTranslation()

  // TODO TMP
  console.log('MODAL')

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
      <Result
        status={level}
        title={t(`userMessage.types.${type}.title`)}
        subTitle={subTitle}
      />
    </Modal>
  )
}

MessageModal.propTypes = {
  message: messageType.isRequired,
  onClose: PropTypes.func,
}

MessageModal.defaultProps = {
  onClose: () => {},
}

export default MessageModal
