import React from 'react'
import { shallow } from 'enzyme'
import { Icon, Menu } from 'antd'

import AffixButtons, { SectionButton } from './AffixButtons'
import { SectionLink } from '../links'
import SidebarToggleButton from '../../Layout/Sidebar/ToggleButton'

let mockNextPrev
jest.mock('react-redux', () => ({
  useSelector: () => mockNextPrev,
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
    mockNextPrev = { prevId: 'section1', nextId: 'section3' }
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
    expect(wrapper.exists(SidebarToggleButton)).toBe(true)
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
})
