import React from 'react'
import PropTypes from 'prop-types'
import Popover from 'antd/lib/popover'

import { useTranslation } from '../../../../../lib/i18n'
import css from './style.sass'
import { childrenType } from '../../../../../lib/propTypes'
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