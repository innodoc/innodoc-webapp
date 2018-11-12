import React from 'react'
import { shallow } from 'enzyme'

import { SectionNav } from './SectionNav'
import SectionLink from '../../SectionLink'

describe('<SectionNav />', () => {
  const prevSection = {
    id: 'section1',
    title: { en: [{ t: 'Str', c: 'Section 1' }] },
  }
  const nextSection = {
    id: 'section2',
    title: { en: [{ t: 'Str', c: 'Section 2' }] },
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
    expect(prevSectionLink.find('a')).toExist()
    expect(nextSectionLink.find('a')).toExist()
    const prevSectionInnerLink = prevSectionLink.find('a')
    const nextSectionInnerLink = nextSectionLink.find('a')
    expect(prevSectionInnerLink.prop('title')).toBe('Section 1')
    expect(nextSectionInnerLink.prop('title')).toBe('Section 2')
  })
})
