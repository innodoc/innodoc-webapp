import { Alert, Typography } from 'antd'
import { Trans, useTranslation } from 'next-i18next'

import { feedbackMessageType, feedbackMessagesType } from '@innodoc/misc/propTypes'

import css from './InputPopover.module.sss'

function Message({ message }) {
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
  message: feedbackMessageType.isRequired,
}

function Messages({ messages }) {
  return messages.length ? (
    <>
      {messages.map((message) => (
        <div className={css.messageItem} key={message.msg}>
          <Message message={message} />
        </div>
      ))}
    </>
  ) : null
}

Messages.propTypes = {
  messages: feedbackMessagesType.isRequired,
}

export { Message } // for testing
export default Messages