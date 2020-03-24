import React from 'react'
import { shallow } from 'enzyme'
import { Form, Input } from 'antd'

import EmailField from './EmailField'

describe('<EmailField />', () => {
  it('should render', () => {
    const wrapper = shallow(<EmailField />)
    const formItem = wrapper.find(Form.Item)
    expect(formItem.prop('name')).toBe('email')
    expect(formItem.prop('validateFirst')).toBe(true)
    const input = wrapper.find(Input)
    expect(input.prop('autoComplete')).toBe('email')
  })

  it.each([true, false])('should render disabled=%s', (val) =>
    expect(
      shallow(<EmailField disabled={val} />)
        .find(Input)
        .prop('disabled')
    ).toBe(val)
  )

  it.each([true, false])('should render hasLabel=%s', (val) => {
    const wrapper = shallow(<EmailField hasLabel={val} />)
    expect(wrapper.find(Form.Item).prop('label')).toBe(
      val ? 'user.email' : undefined
    )
    expect(wrapper.find(Input).prop('placeholder')).toBe(
      val ? undefined : 'user.email'
    )
  })

  it('should use extra rules', () => {
    const extraRules = [{ extra: 'rule' }]
    const wrapper = shallow(<EmailField rules={extraRules} />)
    const formItem = wrapper.find(Form.Item)
    expect(formItem.prop('rules')).toHaveLength(3)
  })
})
