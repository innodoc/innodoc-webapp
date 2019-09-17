import React from 'react'
import PropTypes from 'prop-types'
import Popover from 'antd/es/popover'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { childrenType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sass'
import MathJaxDiv from './MathJaxDiv'

const InputPopover = ({ children, messages, userInput }) => {
  const { t } = useTranslation()
  const messageItems = messages.map((message, i) => (
    <li key={i.toString()}>
      {message}
    </li>
  ))
  const messageList = messageItems.length
    ? <ul className={css.messageList}>{messageItems}</ul>
    : null
  const content = (
    <>
      <div className={css.mathJaxWrapper}>
        <MathJaxDiv texCode={userInput} />
      </div>
      {messageList}
    </>
  )
  return (
    <Popover
      content={content}
      placement="bottom"
      title={t('questions.inputFeedback')}
      trigger={['focus']}
      overlayClassName={css.popover}
    >
      {children}
    </Popover>
  )
}

InputPopover.propTypes = {
  children: childrenType.isRequired,
  messages: PropTypes.arrayOf(PropTypes.string),
  userInput: PropTypes.string,
}

InputPopover.defaultProps = {
  messages: [],
  userInput: '',
}

export default InputPopover
