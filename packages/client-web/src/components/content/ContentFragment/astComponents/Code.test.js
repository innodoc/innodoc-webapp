import React from 'react'
import { shallow } from 'enzyme'
import { Typography } from 'antd'

import Code from './Code'

const data = [['fooId', 'fooClass', null], 'echo "hello world!"']

describe('<Code />', () => {
  it('should render', () => {
    const wrapper = shallow(<Code data={data} />)
    const code = wrapper.find(Typography.Text)
    expect(code).toHaveLength(1)
    expect(code.prop('id')).toEqual('fooId')
    expect(code.hasClass('fooClass')).toBe(true)
    expect(code.children().text()).toBe('echo "hello world!"')
  })
})
