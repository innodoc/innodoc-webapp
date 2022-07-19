import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Checkbox } from 'antd'

import css from './Question.module.sss'

const CheckboxQuestion = ({ className, onChange, icon, value }) => {
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

CheckboxQuestion.defaultProps = {
  className: '',
  icon: null,
  value: null,
}

CheckboxQuestion.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default CheckboxQuestion
