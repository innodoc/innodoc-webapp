import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Popover } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { childrenType, feedbackMessagesType } from '@innodoc/client-misc/src/propTypes'

import MathJaxPreview from './MathJaxPreview'
import Messages from './Messages'
import css from './style.sss'

const InputPopover = ({ children, focus, messages, showPreview, userInput }) => {
  const { t } = useTranslation()
  const { lg } = Grid.useBreakpoint()
  const hasData = Boolean(messages.length) || Boolean(userInput.length)

  const preview = showPreview ? (
    <div className={css.mathJaxPreview}>
      <div className={css.previewLabel}>{t('questions.preview')}</div>
      <MathJaxPreview texCode={userInput || ''} />
    </div>
  ) : null

  const content = (
    <>
      {preview}
      <Messages messages={messages} />
    </>
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
  userInput: PropTypes.string.isRequired,
}

InputPopover.defaultProps = {
  messages: [],
}

export default InputPopover
