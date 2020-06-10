import React from 'react'
import { shallow } from 'enzyme'
import { Input } from 'antd'

import InputPopover from './InputPopover'
import InputQuestion from './InputQuestion'

const Icon = () => null

const messages = [{ msg: 'foo', type: 'success' }]

describe('<InputQuestion />', () => {
  it.each([
    [null, ''],
    ['test1', 'test1'],
  ])('should render with value=%s', (value, expValue) => {
    const onChange = jest.fn()
    const wrapper = shallow(
      <InputQuestion
        attributes={{ validation: 'parsed' }}
        className="customClass"
        icon={<Icon />}
        messages={messages}
        onChange={onChange}
        value={value}
      />
    )

    const inputPopover = wrapper.find(InputPopover)
    expect(inputPopover.prop('focus')).toBe(false)
    expect(inputPopover.prop('messages')).toBe(messages)
    expect(inputPopover.prop('showPreview')).toBe(true)
    expect(inputPopover.prop('userInput')).toBe('')

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
      <InputQuestion
        attributes={attrs}
        icon={<Icon />}
        messages={[{ msg: 'foo', type: 'success' }]}
        onChange={() => {}}
      />
    )
    const input = wrapper.find(Input)
    expect(input.prop('style').width).toBe(expWidth)
  })
})
