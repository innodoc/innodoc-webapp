import React from 'react'
import { mount } from 'enzyme'
import { List } from 'antd'

import appSelectors from '@innodoc/client-store/src/selectors'

import { SectionLink } from '../content/links'
import TermIndex from './TermIndex'

const mockTerms = [
  {
    id: 'term1',
    language: 'en',
    locations: [
      'section-1/subsection-1#index-term-term1-0',
      'section-1/subsection-1#index-term-term1-1',
      'section-2#index-term-term1-0',
    ],
    name: 'Term 1',
  },
  {
    id: 'term2',
    language: 'en',
    locations: [
      'section-1/subsection-1#index-term-term2-0',
      'section-3#index-term-term2-0',
    ],
    name: 'Term 2',
  },
]
const mockAppSelectors = appSelectors
jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockAppSelectors.getApp) {
      return { language: 'en' }
    }
    return mockTerms
  },
}))

describe('<TermIndex />', () => {
  it('should render', () => {
    const wrapper = mount(<TermIndex />)
    const listItems = wrapper.find(List.Item)
    expect(listItems).toHaveLength(2)
    const getTitle = (i) =>
      listItems
        .at(i)
        .find(List.Item.Meta)
        .prop('title').props.children
    expect(getTitle(0)).toMatch('Term 1')
    expect(getTitle(1)).toMatch('Term 2')
    const sectionLinks = wrapper.find(SectionLink)
    expect(sectionLinks).toHaveLength(5)
    expect(sectionLinks.at(0).prop('contentId')).toBe(
      'section-1/subsection-1#index-term-term1-0'
    )
    expect(sectionLinks.at(1).prop('contentId')).toBe(
      'section-1/subsection-1#index-term-term1-1'
    )
    expect(sectionLinks.at(2).prop('contentId')).toBe(
      'section-2#index-term-term1-0'
    )
    expect(sectionLinks.at(3).prop('contentId')).toBe(
      'section-1/subsection-1#index-term-term2-0'
    )
    expect(sectionLinks.at(4).prop('contentId')).toBe(
      'section-3#index-term-term2-0'
    )
  })
})
