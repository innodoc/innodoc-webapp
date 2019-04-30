import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Input from 'antd/lib/input'

import css from './style.sass'

const DEFAULT_INPUT_LENGTH = 10

const InputQuestion = ({
  attributes,
  className,
  icon,
  onChange,
  value,
}) => (
  <Input
    value={value || ''}
    style={{ width: `${(2 / 3 * attributes.length) || DEFAULT_INPUT_LENGTH}em` }}
    className={classNames(css.inputQuestion, className)}
    onChange={ev => onChange(ev.target.value)}
    suffix={icon}
  />
)

InputQuestion.propTypes = {
  attributes: PropTypes.object.isRequired,
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

InputQuestion.defaultProps = {
  className: '',
  value: null,
}

export default InputQuestion
