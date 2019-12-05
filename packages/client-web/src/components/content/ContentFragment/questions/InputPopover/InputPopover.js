import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import { MathJaxDiv, MathJaxProvider } from '@innodoc/react-mathjax-node'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { childrenType } from '@innodoc/client-misc/src/propTypes'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'
import css from './style.sss'

const InputPopover = ({ children, messages, userInput }) => {
  const { mathJaxOptions } = useSelector(courseSelectors.getCurrentCourse)
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
        <MathJaxProvider options={mathJaxOptions}>
          <MathJaxDiv
            classNameHide={fadeInCss.hide}
            classNameShow={fadeInCss.show}
            texCode={userInput}
          />
        </MathJaxProvider>
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
