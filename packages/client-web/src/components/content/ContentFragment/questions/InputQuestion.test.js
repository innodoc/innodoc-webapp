import React from 'react'
import { shallow } from 'enzyme'
import { Icon, Input } from 'antd'

import InputQuestion from './InputQuestion'

describe('<InputQuestion />', () => {
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
    expect(input.hasClass('inputQuestion')).toBe(true)
    expect(input.hasClass('customClass')).toBe(true)
    expect(input.prop('value')).toBe(expValue)
    input.prop('onChange')({ target: { value: '27' } })
    expect(onChange).toBeCalledWith('27')
  })

  it.each([
    ['16ch', {}],
    ['36ch', { length: '30' }],
  ])('should add width style (expecting %s)', (expWidth, attrs) => {
    const wrapper = shallow(
      <InputQuestion attributes={attrs} icon={<Icon />} onChange={() => {}} />
    )
    const input = wrapper.find(Input)
    expect(input.prop('style').width).toBe(expWidth)
  })
})
