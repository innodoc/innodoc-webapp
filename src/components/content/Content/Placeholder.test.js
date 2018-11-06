import React from 'react'
import { shallow } from 'enzyme'
import Skeleton from 'antd/lib/skeleton'

import Placeholder from './Placeholder'

describe('<Placeholder />', () => {
  it('renders', () => {
    const wrapper = shallow(<Placeholder />)
    expect(wrapper.find(Skeleton).length).toBeGreaterThanOrEqual(1)
  })
})
