import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Input } from 'antd'

import { feedbackMessagesType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sss'
import InputPopover from './InputPopover'

const DEFAULT_INPUT_LENGTH = 10

const InputQuestion = ({
  attributes,
  className,
  icon,
  invalid,
  latexCode,
  messages,
  onChange,
  showResult,
  value,
}) => {
  const [focus, setFocus] = useState(false)
  const length = parseInt(attributes.length, 10) || DEFAULT_INPUT_LENGTH
  const { validation } = attributes
  const showPreview = ['exact-fraction', 'function', 'interval', 'parsed'].includes(validation)

  return (
    <InputPopover
      focus={focus}
      messages={messages}
      showPreview={showPreview}
      showResult={showResult || invalid}
      userInput={latexCode}
    >
      <Input
        className={classNames(css.inputQuestion, className)}
        maxLength={length}
        onBlur={() => setFocus(false)}
        onChange={(ev) => onChange(ev.target.value)}
        onFocus={() => setFocus(true)}
        style={{ width: `${length + 6}ch` }}
        suffix={icon}
        value={value || ''}
      />
    </InputPopover>
  )
}

InputQuestion.defaultProps = {
  className: '',
  icon: null,
  latexCode: '',
  value: '',
}

InputQuestion.propTypes = {
  attributes: PropTypes.object.isRequired,
  className: PropTypes.string,
  icon: PropTypes.element,
  invalid: PropTypes.bool.isRequired,
  latexCode: PropTypes.string,
  messages: feedbackMessagesType.isRequired,
  onChange: PropTypes.func.isRequired,
  showResult: PropTypes.bool.isRequired,
  value: PropTypes.string,
}

export default InputQuestion
