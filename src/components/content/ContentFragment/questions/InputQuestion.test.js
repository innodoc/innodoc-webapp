import React from 'react'
import { shallow } from 'enzyme'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'

import InputQuestion from './InputQuestion'

describe('<FeedbackIcon />', () => {
  it.each([
    [null, ''],
    ['test1', 'test1'],
  ])('should render with value=%s', (value, expValue) => {
    const onChange = jest.fn()
    const wrapper = shallow(
      <InputQuestion
        attributes={{}}
        className="customClass"
        icon={<Icon />}
        onChange={onChange}
        value={value}
      />
    )
    const input = wrapper.find(Input)
    expect(input.prop('className')).toMatch('inputQuestion')
    expect(input.prop('className')).toMatch('customClass')
    expect(input.prop('value')).toBe(expValue)
    input.prop('onChange')({ target: { value: '27' } })
    expect(onChange).toBeCalledWith('27')
  })

  it.each([
    ['10em', {}],
    ['20em', { length: '30' }],
  ])('should add width style (expecting %s)', (expWidth, attrs) => {
    const wrapper = shallow(
      <InputQuestion
        attributes={attrs}
        icon={<Icon />}
        onChange={() => {}}
      />
    )
    const input = wrapper.find(Input)
    expect(input.prop('style').width).toBe(expWidth)
  })
})
