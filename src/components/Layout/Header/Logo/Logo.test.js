import React from 'react'
import { shallow } from 'enzyme'

import Logo from './Logo'

describe('<Logo />', () => {
  it('should render', () => {
    const wrapper = shallow(<Logo />)
    expect(wrapper.find('img').exists()).toBe(true)
  })
})
