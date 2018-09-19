import React from 'react'
import { shallow } from 'enzyme'
import { Header, Image } from 'semantic-ui-react'

import Placeholder from './Placeholder'

describe('<Placeholder />', () => {
  it('renders', () => {
    const wrapper = shallow(<Placeholder />)
    expect(wrapper.find(Image)).toHaveLength(2)
    expect(wrapper.find(Header)).toHaveLength(1)
    expect(wrapper.find('p')).toHaveLength(2)
  })
})
