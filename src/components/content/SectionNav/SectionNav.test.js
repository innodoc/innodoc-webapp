import React from 'react'
import { shallow } from 'enzyme'

import { BareSectionNav as SectionNav, mapStateToProps } from './SectionNav'
import SectionLink from '../../SectionLink'

describe('<SectionNav />', () => {
  // const prevSection = 'section1'
  // const nextSection = 'section3'

  it('renders', () => {
    const wrapper = shallow(<SectionNav prevId="section1" nextId="section3" />)
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
    const wrapper = shallow(<SectionNav nextId="next" />)
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(1)
    const nextSectionLink = sectionLinks.at(0)
    expect(nextSectionLink.prop('sectionId')).toBe('next')
    expect(nextSectionLink.find('a')).toBeTruthy()
  })

  it('renders only prev', () => {
    const wrapper = shallow(<SectionNav prevId="prev" />)
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(1)
    const prevSectionLink = sectionLinks.at(0)
    expect(prevSectionLink.prop('sectionId')).toBe('prev')
    expect(prevSectionLink.find('a')).toBeTruthy()
  })
})

jest.mock('../../../store/selectors/index.js', () => ({
  getApp: () => ({ language: 'en' }),
}))
jest.mock('../../../store/selectors/section/index.js', () => ({
  getNextPrevSections: () => ({
    next: 'next',
    prev: 'prev',
  }),
}))

describe('mapStateToProps', () => {
  it('returns next and prev section', () => {
    const props = mapStateToProps(null)
    expect(props.next).toEqual('next')
    expect(props.prev).toEqual('prev')
  })
})
