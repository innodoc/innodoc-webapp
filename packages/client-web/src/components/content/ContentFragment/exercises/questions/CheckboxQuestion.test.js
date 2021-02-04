import React from 'react'
import { shallow } from 'enzyme'
import { Checkbox } from 'antd'

import CheckboxQuestion from './CheckboxQuestion'
import css from './style.sss'

const MockIcon = () => {}

describe('<CheckboxQuestion />', () => {
  it.each([
    ['0', false, false],
    ['1', true, false],
    [null, undefined, true],
  ])(
    'should render: value=%s, checkbox(checked=%s, indeterminate=%s)',
    (value, checked, indeterminate) => {
      const onChange = jest.fn()
      const wrapper = shallow(
        <CheckboxQuestion
          className="customClass"
          icon={<MockIcon />}
          onChange={onChange}
          value={value}
        />
      )
      expect(wrapper.find(MockIcon)).toHaveLength(1)
      const cb = wrapper.find(Checkbox)
      expect(cb.hasClass(css.checkbox)).toBe(true)
      expect(cb.hasClass('customClass')).toBe(true)
      expect(cb.prop('checked')).toBe(checked)
      if (indeterminate) {
        expect(cb.prop('indeterminate')).toBeTruthy()
      } else {
        expect(cb.prop('indeterminate')).toBeFalsy()
      }
      cb.prop('onChange')({ target: { checked: false } })
      cb.prop('onChange')({ target: { checked: true } })
      expect(onChange).toBeCalledTimes(2)
      expect(onChange).nthCalledWith(1, '0')
      expect(onChange).nthCalledWith(2, '1')
    }
  )
})
