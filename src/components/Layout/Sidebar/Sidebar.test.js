import React from 'react'
import { shallow } from 'enzyme'
import { Menu, Transition } from 'semantic-ui-react'

import { Sidebar } from './Sidebar'
import Toc from '../../Toc'

describe('<Sidebar />', () => {
  const wrapper = shallow(
    <Sidebar t={() => ''} onSidebarToggleClick={() => {}} visible toc={[]}>
      <p>
        Sidebar content
      </p>
    </Sidebar>
  )
  it('should render children', () => {
    expect(wrapper.find('p').exists()).toBe(true)
  })
  it('should have 1 transition', () => {
    expect(wrapper.find(Transition)).toHaveLength(1)
  })
  it('should have 1 menu', () => {
    expect(wrapper.find(Menu)).toHaveLength(1)
  })
  it('should have 1 toc', () => {
    expect(wrapper.find(Toc)).toHaveLength(1)
  })
})
