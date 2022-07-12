import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Popover } from 'antd'

import { propTypes } from '@innodoc/client-misc'

import MathJaxPreview from './MathJaxPreview'
import Messages from './Messages'
import css from './InputPopover.module.sss'

const InputPopover = ({ children, focus, messages, showPreview, showResult, userInput }) => {
  const { lg } = Grid.useBreakpoint()

  const preview =
    showPreview && userInput.length ? (
      <div className={css.mathJaxPreview}>
        <MathJaxPreview texCode={userInput || ''} />
      </div>
    ) : null

  const messageList = messages.length && showResult ? <Messages messages={messages} /> : null

  const content = (
    <>
      {preview}
      {messageList}
    </>
  )

  return (
    <Popover
      content={content}
      placement={lg ? 'rightTop' : 'bottom'}
      trigger={[]}
      overlayClassName={css.popover}
      visible={Boolean(focus && (preview || messageList))}
    >
      {children}
    </Popover>
  )
}

InputPopover.propTypes = {
  children: propTypes.childrenType.isRequired,
  focus: PropTypes.bool.isRequired,
  messages: propTypes.feedbackMessagesType,
  showPreview: PropTypes.bool.isRequired,
  showResult: PropTypes.bool.isRequired,
  userInput: PropTypes.string.isRequired,
}

InputPopover.defaultProps = {
  messages: [],
}

export default InputPopover
