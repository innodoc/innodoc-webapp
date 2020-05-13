import React from 'react'
import { shallow } from 'enzyme'

import Index from './Index'

jest.mock('../Layout', () => () => null)

describe('<IndexPage />', () => {
  it('should render empty', () => {
    const wrapper = shallow(<Index />)
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})
