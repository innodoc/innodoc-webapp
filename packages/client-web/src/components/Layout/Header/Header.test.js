import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import Drawer from 'antd/lib/drawer'

import { SectionLink } from '../../content/links'
import Header from './Header'
import Nav from './Nav'
import Logo from './Logo'
import SearchInput from './SearchInput'

let mockCourse
jest.mock('react-redux', () => ({
  useSelector: () => mockCourse,
}))
let mockUseIsNarrowerThan
jest.mock('../../../hooks/useIsNarrowerThan', () => (
  () => mockUseIsNarrowerThan
))

describe('<Header />', () => {
  beforeEach(() => {
    mockCourse = { homeLink: 'foo' }
    mockUseIsNarrowerThan = false
  })

  it('should render', () => {
    const wrapper = shallow(<Header />)
    expect(wrapper.find(AntLayout.Header).exists()).toBe(true)
    expect(wrapper.find(SectionLink)).toHaveLength(1)
    expect(wrapper.find(Logo)).toHaveLength(1)
    expect(wrapper.find(Button)).toHaveLength(1)
    expect(wrapper.find(SearchInput)).toHaveLength(2)
    expect(wrapper.find(Nav)).toHaveLength(2)
  })

  it('should render without home link', () => {
    mockCourse = {}
    const wrapper = shallow(<Header />)
    expect(wrapper.find(SectionLink)).toHaveLength(0)
  })

  describe('mobile menu', () => {
    beforeEach(() => {
      mockUseIsNarrowerThan = true
    })

    it('should render', () => {
      const wrapper = shallow(<Header />)
      expect(wrapper.find(Drawer).prop('visible')).toBe(false)
    })

    it('should activate and close drawer menu', () => {
      const wrapper = shallow(<Header />)
      wrapper.find(Button).at(0).simulate('click')
      expect(wrapper.find(Drawer).prop('visible')).toBe(true)
      wrapper.find(Drawer).prop('onClose')()
      expect(wrapper.find(Drawer).prop('visible')).toBe(false)
    })
  })
})
