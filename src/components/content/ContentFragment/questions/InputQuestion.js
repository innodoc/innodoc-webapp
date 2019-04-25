import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Input from 'antd/lib/input'

import css from './style.sass'
import FeedbackIcon from './FeedbackIcon'

const DEFAULT_INPUT_LENGTH = 14

const InputQuestion = ({
  attributes,
  correct,
  onChange,
  value,
}) => {
  const length = Object.prototype.hasOwnProperty.call(attributes, 'length')
    ? attributes.length
    : DEFAULT_INPUT_LENGTH
  const inputClassNames = classNames(
    css.inputQuestion,
    value === '' ? {} : { [css.correct]: correct, [css.incorrect]: !correct },
  )
  return (
    <Input
      value={value}
      style={{ width: `${length}em` }}
      className={inputClassNames}
      onChange={ev => onChange(ev.target.value)}
      suffix={<FeedbackIcon correct={value === '' ? null : correct} />}
    />
  )
}

InputQuestion.propTypes = {
  attributes: PropTypes.object.isRequired,
  correct: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

InputQuestion.defaultProps = {
  correct: null,
}

export default InputQuestion
