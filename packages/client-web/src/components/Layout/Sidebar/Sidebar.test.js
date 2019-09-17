import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/es/layout'

import Sidebar from './Sidebar'

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

  describe('should render', () => {
    test('with children', () => {
      const wrapper = shallow(<Sidebar>Foo</Sidebar>)
      expect(wrapper.find(AntLayout.Sider)).toHaveLength(1)
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
