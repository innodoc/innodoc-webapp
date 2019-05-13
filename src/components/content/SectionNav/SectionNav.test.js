import React from 'react'
import { shallow } from 'enzyme'

import { SectionNav } from './SectionNav'
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
})
