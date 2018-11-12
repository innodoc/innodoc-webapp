import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'

import { Sidebar } from './Sidebar'
import Toc from '../../Toc'

describe('<Sidebar />', () => {
  describe('render', () => {
    it('should render and have one toc', () => {
      const wrapper = shallow(
        <Sidebar
          t={() => ''}
          dispatchToggleSidebar={() => undefined}
          visible
        />
      )
      expect(wrapper.find(AntLayout.Sider)).toHaveLength(1)
      expect(wrapper.find(Toc)).toHaveLength(1)
    })

    it('should render collapsed', () => {
      const wrapper = shallow(
        <Sidebar
          t={() => ''}
          dispatchToggleSidebar={() => undefined}
          visible={false}
        />
      )
      expect(wrapper.find(AntLayout.Sider).prop('collapsed')).toBe(true)
    })
  })

  describe('collapse button', () => {
    const mockDispatchToggleSidebar = jest.fn()
    const wrapper = shallow(
      <Sidebar
        t={() => ''}
        dispatchToggleSidebar={mockDispatchToggleSidebar}
        visible
      />
    )

    const button = wrapper.find(Button)

    it('should render', () => {
      expect(button.exists()).toBe(true)
    })

    it('triggers sidebar collapse', () => {
      button.simulate('click')
      expect(mockDispatchToggleSidebar.mock.calls).toHaveLength(1)
    })
  })

  describe('breakpoints', () => {
    const wrapper = shallow(
      <Sidebar
        t={() => ''}
        dispatchToggleSidebar={() => undefined}
        visible={false}
      />
    )

    it('should have initial value', () => {
      expect(wrapper.find(AntLayout.Sider).prop('width')).toBe(300)
    })

    it('should adjust width when not breaking', () => {
      wrapper.instance().onBreak(false)
      expect(wrapper.find(AntLayout.Sider).prop('width')).toBe(400)
    })

    it('should adjust width when breaking', () => {
      wrapper.instance().onBreak(true)
      expect(wrapper.find(AntLayout.Sider).prop('width')).toBe(300)
    })
  })
})
