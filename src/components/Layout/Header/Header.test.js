import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import Drawer from 'antd/lib/drawer'

import SectionLink from '../../SectionLink'
import Header from './Header'
import Nav from './Nav'
import Logo from './Logo'
import SearchInput from './SearchInput'
import courseSelectors from '../../../store/selectors/course'

const mockGetCurrentCourse = courseSelectors.getCurrentCourse
let mockApp
let mockCourse
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: selector => (
    selector === mockGetCurrentCourse
      ? mockCourse
      : mockApp
  ),
}))
let mockUseIsNarrowerThan
jest.mock('../../../hooks/useIsNarrowerThan', () => (
  () => mockUseIsNarrowerThan
))

describe('<Header />', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockApp = { sidebarVisible: true }
    mockCourse = { homeLink: 'foo' }
    mockUseIsNarrowerThan = false
  })

  it('should render', () => {
    const wrapper = shallow(<Header disableSidebar={false} />)
    expect(wrapper.find(AntLayout.Header).exists()).toBe(true)
    expect(wrapper.find(SectionLink)).toHaveLength(1)
    expect(wrapper.find(Logo)).toHaveLength(1)
    const buttons = wrapper.find(Button)
    expect(buttons).toHaveLength(2)
    expect(buttons.at(0).prop('className')).toContain('active')
    expect(wrapper.find(SearchInput)).toHaveLength(2)
    expect(wrapper.find(Nav)).toHaveLength(2)
    expect(mockDispatch.mock.calls).toHaveLength(0)
  })

  it('should render without home link', () => {
    mockCourse = {}
    const wrapper = shallow(<Header disableSidebar={false} />)
    expect(wrapper.find(SectionLink)).toHaveLength(0)
  })

  describe('sidebar', () => {
    it('should render with sidebar not visible', () => {
      mockApp.sidebarVisible = false
      const wrapper = shallow(<Header disableSidebar={false} />)
      expect(wrapper.find(Button).at(0).prop('className')).not.toContain('active')
    })

    it('should render w/o sidebar', () => {
      const wrapper = shallow(<Header disableSidebar />)
      expect(wrapper.find(AntLayout.Header).exists()).toBe(true)
      expect(wrapper.find(Button)).toHaveLength(1)
    })

    it('should dispatch toggleSidebar', () => {
      const wrapper = shallow(<Header disableSidebar={false} />)
      wrapper.find(Button).at(0).simulate('click')
      expect(mockDispatch.mock.calls).toHaveLength(1)
    })
  })

  describe('mobile menu', () => {
    beforeEach(() => {
      mockUseIsNarrowerThan = true
    })

    it('should render', () => {
      const wrapper = shallow(<Header disableSidebar={false} />)
      expect(wrapper.find(Drawer).prop('visible')).toBe(false)
    })

    it('should activate and close drawer menu', () => {
      const wrapper = shallow(<Header disableSidebar={false} />)
      wrapper.find(Button).at(1).simulate('click')
      expect(wrapper.find(Drawer).prop('visible')).toBe(true)
      wrapper.find(Drawer).prop('onClose')()
      expect(wrapper.find(Drawer).prop('visible')).toBe(false)
    })
  })
})
