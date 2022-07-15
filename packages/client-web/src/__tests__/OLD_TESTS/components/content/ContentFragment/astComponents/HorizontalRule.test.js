import React from 'react'
import { shallow } from 'enzyme'
import { Divider } from 'antd'

import HorizontalRule from './HorizontalRule'

describe('<HorizontalRule />', () => {
  it('should render', () => {
    const wrapper = shallow(<HorizontalRule />)
    expect(wrapper.exists(Divider)).toBe(true)
  })
})
