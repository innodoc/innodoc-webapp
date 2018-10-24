import React from 'react'
import PropTypes from 'prop-types'
import { Header, Modal } from 'semantic-ui-react'
import { withNamespaces } from 'react-i18next'

import { messageType } from '../../lib/propTypes'

const MessageModal = ({ t, message, onClose }) => {
  const { level, title, msg } = message
  const closable = level !== 'fatal'
  const isError = ['error', 'fatal'].includes(level)
  const color = isError ? 'red' : 'black'
  const icon = isError ? 'bug' : 'info'
  return (
    <Modal
      onClose={onClose}
      closeIcon={closable}
      centered={false}
      closeOnDimmerClick={closable}
      closeOnEscape={closable}
      defaultOpen
    >
      <Header color={color} icon={icon} content={t(`message.title.${level}`)} />
      <Modal.Content>
        <Modal.Description>
          <Header content={title} />
          <p>
            {msg}
          </p>
        </Modal.Description>
      </Modal.Content>
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
export default withNamespaces()(MessageModal)
