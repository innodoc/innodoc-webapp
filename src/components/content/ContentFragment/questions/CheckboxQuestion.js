import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Checkbox from 'antd/lib/checkbox'

import css from './style.sass'

const CheckboxQuestion = ({
  className,
  onChange,
  icon,
  value,
}) => {
  const valueProp = {}
  if (value === '1') {
    valueProp.checked = true
  } else if (value === '0') {
    valueProp.checked = false
  } else {
    valueProp.indeterminate = true
  }
  return (
    <React.Fragment>
      <Checkbox
        className={classNames(css.checkbox, className)}
        onChange={ev => onChange(ev.target.checked ? '1' : '0')}
        {...valueProp}
      />
      {icon}
    </React.Fragment>
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
