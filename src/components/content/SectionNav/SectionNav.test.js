import React from 'react'
import { shallow } from 'enzyme'

import SectionNav from './SectionNav'
import SectionLink from '../../SectionLink'

let mockNextPrev = {
  prevId: 'section1',
  nextId: 'section3',
}
jest.mock('react-redux', () => ({ useSelector: () => mockNextPrev }))

describe('<SectionNav />', () => {
  it('renders', () => {
    const wrapper = shallow(<SectionNav />)
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(2)
    const prevSectionLink = sectionLinks.at(0)
    const nextSectionLink = sectionLinks.at(1)
    expect(prevSectionLink.prop('sectionId')).toBe('section1')
    expect(nextSectionLink.prop('sectionId')).toBe('section3')
    expect(prevSectionLink.find('a')).toBeTruthy()
    expect(nextSectionLink.find('a')).toBeTruthy()
  })

  it('renders only next', () => {
    mockNextPrev = { nextId: 'next' }
    const wrapper = shallow(<SectionNav />)
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(1)
    const nextSectionLink = sectionLinks.at(0)
    expect(nextSectionLink.prop('sectionId')).toBe('next')
    expect(nextSectionLink.find('a')).toBeTruthy()
  })

  it('renders only prev', () => {
    mockNextPrev = { prevId: 'prev' }
    const wrapper = shallow(<SectionNav />)
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(1)
    const prevSectionLink = sectionLinks.at(0)
    expect(prevSectionLink.prop('sectionId')).toBe('prev')
    expect(prevSectionLink.find('a')).toBeTruthy()
  })
})
