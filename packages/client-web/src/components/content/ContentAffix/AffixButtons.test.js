import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

import AffixButtons, { SectionButton } from './AffixButtons'
import { SectionLink } from '../links'
import SidebarToggleButton from '../../Layout/Sidebar/ToggleButton'

jest.mock('react-redux', () => ({
  useSelector: () => ({ prevId: 'section1', nextId: 'section3' }),
}))

describe('<AffixButtons />', () => {
  it('should render', () => {
    const wrapper = shallow(<AffixButtons />)
    expect(wrapper.find(SidebarToggleButton)).toHaveLength(1)
    const sectionButtons = wrapper.find(SectionButton)
    expect(sectionButtons).toHaveLength(2)
    expect(sectionButtons.at(0).prop('direction')).toBe('left')
    expect(sectionButtons.at(0).prop('sectionId')).toBe('section1')
    expect(sectionButtons.at(1).prop('direction')).toBe('right')
    expect(sectionButtons.at(1).prop('sectionId')).toBe('section3')
  })
})

describe('<SectionButton />', () => {
  it.each([
    ['prev', 'left', ArrowLeftOutlined],
    ['next', 'right', ArrowRightOutlined],
  ])('should render %s button', (_, dir, Icon) => {
    const wrapper = shallow(<SectionButton direction={dir} sectionId="foo/bar" />)
    expect(wrapper.find(SectionLink).prop('contentId')).toBe('foo/bar')
    const button = wrapper.find(Button)
    expect(button.prop('disabled')).toBe(false)
    const IconComp = () => button.prop('icon')
    const iconWrapper = shallow(<IconComp />)
    expect(iconWrapper.type()).toBe(Icon)
  })

  it.each([
    ['prev', 'left', ArrowLeftOutlined],
    ['next', 'right', ArrowRightOutlined],
  ])('should render disabled %s button', (_, dir, Icon) => {
    const wrapper = shallow(<SectionButton direction={dir} />)
    expect(wrapper.exists(SectionLink)).toBe(false)
    const button = wrapper.find(Button)
    expect(button.prop('disabled')).toBe(true)
    const IconComp = () => button.prop('icon')
    const iconWrapper = shallow(<IconComp />)
    expect(iconWrapper.type()).toBe(Icon)
  })
})
