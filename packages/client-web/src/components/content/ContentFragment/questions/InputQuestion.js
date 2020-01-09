import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Input } from 'antd'

import css from './style.sss'
import InputPopover from './InputPopover'

const DEFAULT_INPUT_LENGTH = 10

const InputQuestion = ({ attributes, className, icon, onChange, value }) => {
  const length = parseInt(attributes.length, 10) || DEFAULT_INPUT_LENGTH
  const messages = [
    'Das funktioniert so leider nicht.',
    'Du hast alles falsch gemacht!',
  ]
  return (
    <InputPopover messages={messages} userInput={value}>
      <Input
        className={classNames(css.inputQuestion, className)}
        maxLength={length}
        onChange={(ev) => onChange(ev.target.value)}
        style={{ width: `${length + 6}ch` }}
        suffix={icon}
        value={value || ''}
      />
    </InputPopover>
  )
}

InputQuestion.propTypes = {
  attributes: PropTypes.object.isRequired,
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

InputQuestion.defaultProps = {
  className: '',
  value: '',
}

export default InputQuestion
