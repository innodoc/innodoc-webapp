import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Checkbox from 'antd/lib/checkbox'

import css from './style.sass'
import FeedbackIcon from './FeedbackIcon'

const CheckboxQuestion = ({ correct, onChange, value }) => {
  const checkboxProps = { onChange: ev => onChange(ev.target.checked ? '1' : '0') }
  if (value === '1') {
    checkboxProps.checked = true
  } else if (value === '0') {
    checkboxProps.checked = false
  } else {
    checkboxProps.indeterminate = true
  }
  checkboxProps.className = classNames(
    css.checkbox,
    correct === null ? {} : { [css.correct]: correct, [css.incorrect]: !correct },
  )
  return (
    <React.Fragment>
      <Checkbox {...checkboxProps} />
      <FeedbackIcon correct={correct} />
    </React.Fragment>
  )
}

CheckboxQuestion.propTypes = {
  correct: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

CheckboxQuestion.defaultProps = {
  correct: null,
  value: null,
}

export default CheckboxQuestion
