import React from 'react'
import { shallow } from 'enzyme'
import { Button, Layout as AntLayout } from 'antd'

import { toggleSidebar } from '@innodoc/client-store/src/actions/ui'

import Sidebar from './Sidebar'

let mockApp
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockApp,
}))

let mockIsNarrowerThan
jest.mock('../../../hooks/useIsNarrowerThan', () => () => mockIsNarrowerThan)

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
      expect(mockDispatch).not.toBeCalled()
    })

    test('collapsed', () => {
      mockApp = { sidebarVisible: false }
      const wrapper = shallow(<Sidebar />)
      expect(wrapper.find(AntLayout.Sider).prop('collapsed')).toBe(true)
      expect(mockDispatch).not.toBeCalled()
    })
  })

  it('should dispatch toggleSidebar', () => {
    const wrapper = shallow(<Sidebar>Foo</Sidebar>)
    wrapper.find(Button).invoke('onClick')()
    expect(mockDispatch).toBeCalledWith(toggleSidebar())
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
