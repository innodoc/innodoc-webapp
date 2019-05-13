import React from 'react'
import { shallow } from 'enzyme'

import { BareSectionNav as SectionNav, mapStateToProps } from './SectionNav'
import SectionLink from '../../SectionLink'

describe('<SectionNav />', () => {
  const prevSection = {
    id: 'section1',
    title: { en: 'Section 1' },
    ord: [0],
  }
  const nextSection = {
    id: 'section3',
    title: { en: 'Section 3' },
    ord: [2],
  }

  it('renders', () => {
    const wrapper = shallow(
      <SectionNav currentLanguage="en" prev={prevSection} next={nextSection} />
    )
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(2)
    const prevSectionLink = sectionLinks.at(0)
    const nextSectionLink = sectionLinks.at(1)
    expect(prevSectionLink.prop('sectionId')).toBe(prevSection.id)
    expect(nextSectionLink.prop('sectionId')).toBe(nextSection.id)
    expect(prevSectionLink.find('a')).toBeTruthy()
    expect(nextSectionLink.find('a')).toBeTruthy()
    const prevSectionInnerLink = prevSectionLink.find('a')
    const nextSectionInnerLink = nextSectionLink.find('a')
    expect(prevSectionInnerLink.prop('title')).toBe('Section 1')
    expect(nextSectionInnerLink.prop('title')).toBe('Section 3')
  })

  it('renders only next', () => {
    const wrapper = shallow(
      <SectionNav currentLanguage="en" next={nextSection} />
    )
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(1)
    const nextSectionLink = sectionLinks.at(0)
    expect(nextSectionLink.prop('sectionId')).toBe(nextSection.id)
    expect(nextSectionLink.find('a')).toBeTruthy()
    const nextSectionInnerLink = nextSectionLink.find('a')
    expect(nextSectionInnerLink.prop('title')).toBe('Section 3')
  })

  it('renders only prev', () => {
    const wrapper = shallow(
      <SectionNav currentLanguage="en" prev={prevSection} />
    )
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(1)
    const prevSectionLink = sectionLinks.at(0)
    expect(prevSectionLink.prop('sectionId')).toBe(prevSection.id)
    expect(prevSectionLink.find('a')).toBeTruthy()
    const prevSectionInnerLink = prevSectionLink.find('a')
    expect(prevSectionInnerLink.prop('title')).toBe('Section 1')
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
    expect(props.currentLanguage).toEqual('en')
  })
})
