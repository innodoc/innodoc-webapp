import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Popover } from 'antd'

import { childrenType, feedbackMessagesType } from '@innodoc/client-misc/src/propTypes'

import MathJaxPreview from './MathJaxPreview'
import Messages from './Messages'
import css from './style.sss'

const InputPopover = ({ children, focus, messages, showPreview, showResult, userInput }) => {
  const { lg } = Grid.useBreakpoint()
  const hasData = Boolean(messages.length) || Boolean(userInput.length)

  const preview = showPreview ? (
    <div className={css.mathJaxPreview}>
      <MathJaxPreview texCode={userInput || ''} />
    </div>
  ) : null

  const content = showResult ? (
    <>
      {preview}
      <Messages messages={messages} />
    </>
  ) : (
    preview
  )

  return (
    <Popover
      content={content}
      placement={lg ? 'rightTop' : 'bottom'}
      trigger={[]}
      overlayClassName={css.popover}
      visible={hasData && focus}
    >
      {children}
    </Popover>
  )
}

InputPopover.propTypes = {
  children: childrenType.isRequired,
  focus: PropTypes.bool.isRequired,
  messages: feedbackMessagesType,
  showPreview: PropTypes.bool.isRequired,
  showResult: PropTypes.bool.isRequired,
  userInput: PropTypes.string.isRequired,
}

InputPopover.defaultProps = {
  messages: [],
}

export default InputPopover
