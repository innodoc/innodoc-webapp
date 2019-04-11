import React from 'react'
import { mount } from 'enzyme'
import List from 'antd/lib/list'

import { SubsectionList } from './SubsectionList'
import SectionLink from '../../../SectionLink'

describe('<Content />', () => {
  it('should render', () => {
    const subsections = [
      {
        id: 'bar-1',
        title: { en: 'Bar section 1' },
        content: { en: [] },
      },
      {
        id: 'bar-2',
        title: { en: 'Bar section 2' },
        content: { en: [] },
      },
    ]
    const wrapper = mount(
      <SubsectionList
        subsections={subsections}
        currentLanguage="en"
        t={() => {}}
      />
    )
    expect(wrapper.exists(List)).toBe(true)
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(2)
    expect(sectionLinks.at(0).prop('sectionId')).toEqual('bar-1')
    expect(sectionLinks.at(0).find('a').text()).toEqual(subsections[0].title.en)
    expect(sectionLinks.at(1).prop('sectionId')).toEqual('bar-2')
    expect(sectionLinks.at(1).find('a').text()).toEqual(subsections[1].title.en)
  })
})
