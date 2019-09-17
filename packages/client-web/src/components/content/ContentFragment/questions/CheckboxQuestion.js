import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Checkbox from 'antd/es/checkbox'

import css from './style.sass'

const CheckboxQuestion = ({
  className,
  onChange,
  icon,
  value,
}) => {
  let checked
  let indeterminate
  if (value === '1') {
    checked = true
  } else if (value === '0') {
    checked = false
  } else {
    indeterminate = true
  }

  return (
    <>
      <Checkbox
        checked={checked}
        className={classNames(css.checkbox, className)}
        indeterminate={indeterminate}
        onChange={(ev) => onChange(ev.target.checked ? '1' : '0')}
      />
      {icon}
    </>
  )
}

CheckboxQuestion.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

CheckboxQuestion.defaultProps = {
  className: '',
  value: null,
}

export default CheckboxQuestion
