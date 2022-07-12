import React from 'react'
import { Alert, Typography } from 'antd'
import { Trans, useTranslation } from 'next-i18next'

import { propTypes } from '@innodoc/client-misc'

import css from './InputPopover.module.sss'

const Message = ({ message }) => {
  const { t } = useTranslation()
  const msgKey = `questions.feedback.${message.msg}`

  let content
  if (Object.hasOwnProperty.call(message, 'interp')) {
    const { need, got } = message.interp
    content = (
      <Trans i18nKey={msgKey}>
        Write <Typography.Text code>{{ need }}</Typography.Text> instead of{' '}
        <Typography.Text code>{{ got }}</Typography.Text>.
      </Trans>
    )
  } else {
    content = t(msgKey)
  }

  return <Alert message={content} type={message.type} showIcon />
}

Message.propTypes = {
  message: propTypes.feedbackMessageType.isRequired,
}

const Messages = ({ messages }) =>
  messages.length ? (
    <>
      {messages.map((message) => (
        <div className={css.messageItem} key={message.msg}>
          <Message message={message} />
        </div>
      ))}
    </>
  ) : null

Messages.propTypes = {
  messages: propTypes.feedbackMessagesType.isRequired,
}

export { Message } // for testing
export default Messages
