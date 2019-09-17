import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'

import { messageType } from '@innodoc/client-misc/src/propTypes'
import { useTranslation } from '@innodoc/client-misc/src/i18n'

import css from './style.sass'

const MessageModal = ({ message, onClose }) => {
  const { t } = useTranslation()
  const { level, title, msg } = message
  const closable = level !== 'fatal'
  const isError = ['error', 'fatal'].includes(level)
  const iconType = isError ? 'warning' : 'info'
  const footer = closable
    ? [<Button key="back" onClick={onClose}>OK</Button>]
    : null

  return (
    <Modal
      title={t(`message.title.${level}`)}
      closable={closable}
      footer={footer}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
      centered
      visible
    >
      <Icon type={iconType} className={css.icon} />
      <h4>{title}</h4>
      <p>{msg}</p>
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
