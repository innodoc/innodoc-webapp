import React from 'react'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'
import Icon from 'antd/lib/icon'

import { withTranslation } from '../../lib/i18n'
import css from './style.sass'
import { messageType } from '../../lib/propTypes'

const MessageModal = ({ t, message, onClose }) => {
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
  t: PropTypes.func.isRequired,
  message: messageType.isRequired,
  onClose: PropTypes.func,
}

MessageModal.defaultProps = {
  onClose: () => {},
}

export { MessageModal } // for testing
export default withTranslation()(MessageModal)
