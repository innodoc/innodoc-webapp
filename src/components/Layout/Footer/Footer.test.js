import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'

import { Footer } from './Footer'

describe('<Footer />', () => {
  const wrapper = shallow(<Footer t={() => {}} />)
  it('should render children', () => {
    expect(wrapper.find(AntLayout.Footer).exists()).toBe(true)
  })
})
