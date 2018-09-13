import React from 'react'
import { shallow } from 'enzyme'

import Main from './Main'

describe('<Main />', () => {
  const wrapper = shallow(
    <Main>
      <p>
        Cool paragraph.
      </p>
    </Main>
  )
  it('should render children', () => {
    expect(wrapper.find('p').exists()).toBe(true)
  })
})
