import React from 'react'
import { mount, shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'

import Sidebar from './Sidebar'
import { toggleSidebar } from '../../../store/actions/ui'

let mockApp
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockApp,
}))

let mockIsNarrowerThan
jest.mock('../../../hooks/useIsNarrowerThan', () => (
  () => mockIsNarrowerThan
))

describe('<Sidebar />', () => {
  beforeEach(() => {
    mockApp = { sidebarVisible: true }
    mockDispatch.mockClear()
    mockIsNarrowerThan = true
  })

  it('should dispatch toggleSidebar', () => {
    // need to mount to render react-sticky children
    const wrapper = mount(<Sidebar />)
    wrapper.find(Button).simulate('click')
    expect(mockDispatch).toBeCalledTimes(1)
    expect(mockDispatch).toBeCalledWith(toggleSidebar())
  })

  describe('should render', () => {
    test('with children', () => {
      // need to mount to render react-sticky children
      const wrapper = mount(<Sidebar>Foo</Sidebar>)
      expect(wrapper.find(AntLayout.Sider)).toHaveLength(1)
      expect(wrapper.find(Button).exists()).toBe(true)
      expect(wrapper.children().text()).toContain('Foo')
    })

    test('collapsed', () => {
      mockApp = { sidebarVisible: false }
      const wrapper = shallow(<Sidebar />)
      expect(wrapper.find(AntLayout.Sider).prop('collapsed')).toBe(true)
    })
  })

  describe('responsive width', () => {
    it('should be 300 for narrow screen', () => {
      const wrapper = shallow(<Sidebar />)
      expect(wrapper.find(AntLayout.Sider).prop('width')).toBe(300)
    })

    it('should be 400 for wide screen', () => {
      mockIsNarrowerThan = false
      const wrapper = shallow(<Sidebar />)
      expect(wrapper.find(AntLayout.Sider).prop('width')).toBe(400)
    })
  })
})
