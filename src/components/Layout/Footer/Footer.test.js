import React from 'react'
import { shallow } from 'enzyme'
import { Segment } from 'semantic-ui-react'

import { Footer } from './Footer'

describe('<Footer />', () => {
  const wrapper = shallow(<Footer t={() => {}} />)
  it('should render children', () => {
    expect(wrapper.find(Segment).exists()).toBe(true)
  })
})
