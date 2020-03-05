import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'antd'

import { messageType } from '@innodoc/client-misc/src/propTypes'
import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { LoadManifestFailure, UnknownError } from './content'

const messageTypeComponentMap = {
  loadManifestFailure: LoadManifestFailure,
}

const mapMessageTypeToComponent = (type) => {
  try {
    return messageTypeComponentMap[type]
  } catch {
    return UnknownError
  }
}

const MessageModal = ({ message, onClose }) => {
  const { t } = useTranslation()
  const ContentComponent = mapMessageTypeToComponent(message.type)

  const closable = true
  const footer = null
  // const footer = closable
  //   ? [
  //       <Button key="back" onClick={onClose}>
  //         OK
  //       </Button>,
  //     ]
  //   : null

  return (
    <Modal
      centered
      closable={closable}
      destroyOnClose
      footer={footer}
      maskClosable={false}
      onCancel={onClose}
      title={t(`userMessage.levels.${message.level}`)}
      visible
    >
      <ContentComponent message={message} />
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
