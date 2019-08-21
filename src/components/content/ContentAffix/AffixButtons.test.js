import React from 'react'
import { shallow } from 'enzyme'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'

import AffixButtons, { SectionButton } from './AffixButtons'
import { SectionLink } from '../links'
import sectionSelectors from '../../../store/selectors/section'
import { toggleSidebar } from '../../../store/actions/ui'

const mockGetNextPrevSections = sectionSelectors.getNextPrevSections
let mockNextPrev
let mockApp
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => (
    selector === mockGetNextPrevSections
      ? mockNextPrev
      : mockApp
  ),
}))

describe('<SectionButton />', () => {
  it('renders', () => {
    const wrapper = shallow(<SectionButton sectionId="foo" direction="left" />)
    expect(wrapper.find(SectionLink).prop('contentId')).toBe('foo')
    expect(wrapper.find('a')).toBeTruthy()
    expect(wrapper.find(Icon).prop('type')).toBe('arrow-left')
  })

  it('renders w/o sectionId', () => {
    const wrapper = shallow(<SectionButton direction="right" />)
    expect(wrapper.exists(SectionLink)).toBe(false)
    expect(wrapper.exists('a')).toBe(false)
    expect(wrapper.find(Icon).prop('type')).toBe('arrow-right')
  })
})

describe('<AffixButtons />', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockNextPrev = { prevId: 'section1', nextId: 'section3' }
    mockApp = { sidebarVisible: true }
  })

  it('renders', () => {
    const wrapper = shallow(<AffixButtons />)
    expect(wrapper.find(Menu.Item)).toHaveLength(3)
    const sectionButtons = wrapper.find(SectionButton)
    expect(sectionButtons).toHaveLength(2)
    expect(sectionButtons.at(0).prop('direction')).toBe('left')
    expect(sectionButtons.at(0).prop('sectionId')).toBe('section1')
    expect(sectionButtons.at(1).prop('direction')).toBe('right')
    expect(sectionButtons.at(1).prop('sectionId')).toBe('section3')
    const sidebarToggle = wrapper.find(Button)
    expect(sidebarToggle.hasClass('active')).toBe(true)
  })

  it('renders with disabled sidebar', () => {
    mockApp = { sidebarVisible: false }
    const wrapper = shallow(<AffixButtons />)
    expect(wrapper.find(Button).hasClass('active')).toBe(false)
  })

  it('renders only next', () => {
    mockNextPrev = { nextId: 'next' }
    const wrapper = shallow(<AffixButtons />)
    const sectionButtons = wrapper.find(SectionButton)
    expect(sectionButtons).toHaveLength(2)
    expect(sectionButtons.at(0).prop('sectionId')).toBeFalsy()
    expect(sectionButtons.at(1).prop('sectionId')).toBe('next')
  })

  it('renders only prev', () => {
    mockNextPrev = { prevId: 'prev' }
    const wrapper = shallow(<AffixButtons />)
    const sectionButtons = wrapper.find(SectionButton)
    expect(sectionButtons).toHaveLength(2)
    expect(sectionButtons.at(0).prop('sectionId')).toBe('prev')
    expect(sectionButtons.at(1).prop('sectionId')).toBeFalsy()
  })

  it('dispatches toggleSidebar', () => {
    const wrapper = shallow(<AffixButtons />)
    wrapper.find(Button).simulate('click')
    expect(mockDispatch).toBeCalledWith(toggleSidebar())
  })
})
