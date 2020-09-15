import React from 'react'
import { mount } from 'enzyme'
import { List } from 'antd'
import MathJax from '@innodoc/react-mathjax-node'

import appSelectors from '@innodoc/client-store/src/selectors'
import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'

import { SectionLink } from '../content/links'
import TermIndex from './TermIndex'

jest.mock('../content/links', () => ({ SectionLink: () => '' }))

const mockTerms = [
  {
    id: 'term1',
    locations: [
      {
        id: 'en/section-1/subsection-1#index-term-term1-0',
        contentId: 'section-1/subsection-1#index-term-term1-0',
      },
      {
        id: 'en/section-1/subsection-1#index-term-term1-1',
        contentId: 'section-1/subsection-1#index-term-term1-1',
      },
      {
        id: 'en/section-2#index-term-term1-0',
        contentId: 'section-2#index-term-term1-0',
      },
    ],
    name: 'Term 1',
  },
  {
    id: 'term2',
    locations: [
      {
        id: 'en/section-1/subsection-1#index-term-term2-0',
        contentId: 'section-1/subsection-1#index-term-term2-0',
      },
      {
        id: 'en/section-3#index-term-term2-0',
        contentId: 'section-3#index-term-term2-0',
      },
    ],
    name: 'Term 2 $x^2$',
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

const makeMockProvider = (typesetDone) => ({ children }) => {
  const value = {
    promiseMakers: { current: [] },
    setTypesetDone: () => {},
    triggerProcessing: () => {},
    typesetDone,
  }
  return <MathJax.Context.Provider value={value}>{children}</MathJax.Context.Provider>
}

describe('<TermIndex />', () => {
  describe.each([true, false])('render (typesetDone=%s)', (typesetDone) => {
    let MockProvider
    let wrapper
    let listItems

    beforeEach(() => {
      MockProvider = makeMockProvider(typesetDone)
      wrapper = mount(
        <MockProvider>
          <TermIndex />
        </MockProvider>
      )
      listItems = wrapper.find(List.Item)
    })

    it('should have correct CSS class', () => {
      expect(
        wrapper
          .find('div')
          .at(1)
          .hasClass(typesetDone ? fadeInCss.show : fadeInCss.hide)
      ).toBe(true)
    })

    it('should have 2 list items', () => {
      expect(listItems).toHaveLength(2)
    })

    it('should have correct titles', () => {
      const getTitle = (i) => listItems.at(i).find(List.Item.Meta).prop('title')
      const title0 = getTitle(0)
      expect(wrapper.wrap(title0.props.children[0].props.children).text()).toMatch('Term 1')
      const title1 = getTitle(1)
      expect(wrapper.wrap(title1.props.children[0].props.children).text()).toMatch('Term 2 ')
      const mathJaxSpan = wrapper.wrap(title1.props.children[1])
      expect(mathJaxSpan.type()).toBe(MathJax.MathJaxNode)
      expect(mathJaxSpan.prop('displayType')).toBe('inline')
      expect(mathJaxSpan.prop('texCode')).toBe('x^2')
    })

    it('should have section links', () => {
      const sectionLinks = wrapper.find(SectionLink)
      expect(sectionLinks).toHaveLength(5)
      expect(sectionLinks.at(0).prop('contentId')).toBe('section-1/subsection-1#index-term-term1-0')
      expect(sectionLinks.at(1).prop('contentId')).toBe('section-1/subsection-1#index-term-term1-1')
      expect(sectionLinks.at(2).prop('contentId')).toBe('section-2#index-term-term1-0')
      expect(sectionLinks.at(3).prop('contentId')).toBe('section-1/subsection-1#index-term-term2-0')
      expect(sectionLinks.at(4).prop('contentId')).toBe('section-3#index-term-term2-0')
    })
  })

  describe('search', () => {
    it('should filter list', async () => {
      const MockProvider = makeMockProvider(true)
      const wrapper = mount(
        <MockProvider>
          <TermIndex />
        </MockProvider>
      )
      const searchInput = wrapper.find('input')
      searchInput.instance().value = 'term 1'
      searchInput.simulate('change')
      const listItems = wrapper.find('li')
      expect(listItems.at(0).prop('style')).toBeFalsy()
      expect(listItems.at(1).prop('style').display).toBe('none')
    })
  })
})
