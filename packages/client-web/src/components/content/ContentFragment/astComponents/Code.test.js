import React from 'react'
import { shallow } from 'enzyme'

import Code from './Code'

const data = [['fooId', 'fooClass', null], 'echo "hello world!"']

describe('<Code />', () => {
  it('should render', () => {
    const wrapper = shallow(<Code data={data} />)
    const code = wrapper.find('code')
    expect(code).toHaveLength(1)
    expect(code.prop('id')).toEqual('fooId')
    expect(code.hasClass('fooClass')).toBe(true)
    expect(code.text()).toEqual('echo "hello world!"')
  })
})
