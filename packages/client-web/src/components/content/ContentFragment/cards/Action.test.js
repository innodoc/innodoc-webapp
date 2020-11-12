import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'antd'

import Action from './Action'

jest.mock('@innodoc/common/src/i18n')

const Icon = () => 'FOOICON'

describe('<Action />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<Action icon={<Icon />} onClick={() => {}} title="bartitle" />)
    const btn = wrapper.find(Button)
    expect(btn.prop('block')).toBe(true)
    expect(btn.prop('type')).toBe('text')
    expect(btn.prop('disabled')).toBe(false)
    expect(btn.exists(Icon)).toBe(true)
    expect(btn.text()).toContain('bartitle')
  })

  it('should render disabled', () => {
    const wrapper = shallow(<Action disabled icon={<Icon />} onClick={() => {}} title="bartitle" />)
    expect(wrapper.find(Button).prop('disabled')).toBe(true)
  })

  it('should pass onClick handler', () => {
    const mockOnClick = jest.fn()
    const wrapper = shallow(<Action icon={<Icon />} onClick={mockOnClick} title="bartitle" />)
    wrapper.find(Button).simulate('click')
    expect(mockOnClick).toBeCalled()
  })
})
