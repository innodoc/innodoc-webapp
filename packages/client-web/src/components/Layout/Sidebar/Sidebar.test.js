import React from 'react'
import { shallow } from 'enzyme'
import { Grid, Layout as AntLayout } from 'antd'

import Sidebar from './Sidebar'
import ToggleButton from './ToggleButton'

let mockApp
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockApp,
}))

let mockXl
Grid.useBreakpoint = jest.fn(() => ({ xl: mockXl }))

describe('<Sidebar />', () => {
  beforeEach(() => {
    mockApp = { sidebarVisible: true }
    mockDispatch.mockClear()
    mockXl = false
  })

  describe('should render', () => {
    test('with children', () => {
      const wrapper = shallow(<Sidebar>Foo</Sidebar>)
      expect(wrapper.find(AntLayout.Sider)).toHaveLength(1)
      expect(wrapper.children().text()).toContain('Foo')
      expect(mockDispatch).not.toBeCalled()
    })

    test('collapsed', () => {
      mockApp = { sidebarVisible: false }
      const wrapper = shallow(<Sidebar />)
      expect(wrapper.find(AntLayout.Sider).prop('collapsed')).toBe(true)
      expect(mockDispatch).not.toBeCalled()
    })

    test('with <ToggleButton />', () => {
      const wrapper = shallow(<Sidebar>Foo</Sidebar>)
      expect(wrapper.exists(ToggleButton)).toBe(true)
    })
  })

  describe('responsive width', () => {
    it('should be 300 for narrow screen', () => {
      const wrapper = shallow(<Sidebar />)
      expect(wrapper.find(AntLayout.Sider).prop('width')).toBe(300)
    })

    it('should be 400 for wide screen', () => {
      mockXl = true
      const wrapper = shallow(<Sidebar />)
      expect(wrapper.find(AntLayout.Sider).prop('width')).toBe(400)
    })
  })
})
