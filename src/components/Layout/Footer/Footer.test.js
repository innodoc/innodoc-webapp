import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'

import { BareFooter as Footer } from './Footer'

describe('<Footer />', () => {
  it('should render children', () => {
    const wrapper = shallow(<Footer t={() => ''} />)
    expect(wrapper.find(AntLayout.Footer).exists()).toBe(true)
  })
})
