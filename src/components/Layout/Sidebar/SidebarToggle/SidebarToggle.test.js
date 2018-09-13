import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'semantic-ui-react'

import SidebarToggle from './SidebarToggle'

describe('<SidebarToggle />', () => {
  const wrapper = shallow(
    <SidebarToggle onClick={() => {}} title="Test title" />
  )
  it('should render a button', () => {
    const btn = wrapper.find(Button)
    expect(btn).toExist()
    expect(btn.prop('title')).toBe('Test title')
  })
})
