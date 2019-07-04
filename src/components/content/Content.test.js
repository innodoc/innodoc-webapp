import React from 'react'
import { shallow } from 'enzyme'

import appSelectors from '../../store/selectors'
import sectionSelectors from '../../store/selectors/section'
import Content from './Content'
import SubsectionList from './SubsectionList'
import Breadcrumb from './Breadcrumb'
import ContentFragment from './ContentFragment'
import SectionNav from './SectionNav'
import fadeInCss from '../../style/fadeIn.sass'

const { typesetStates } = jest.requireActual('../../hooks/useMathJax')

const mockGetApp = appSelectors.getApp
const mockGetCurrentSection = sectionSelectors.getCurrentSection
const mockGetCurrentSubsections = sectionSelectors.getCurrentSubsections

let mockApp
let mockCurrentSection
let mockCurrentSubsections
let mockCurrentTitle
let mockMathJaxElem
let mockTypesetState

jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockGetApp) {
      return mockApp
    }
    if (selector === mockGetCurrentSection) {
      return mockCurrentSection
    }
    if (selector === mockGetCurrentSubsections) {
      return mockCurrentSubsections
    }
    return mockCurrentTitle
  },
}))

jest.mock('../../hooks/useMathJax', () => ({
  typesetStates: jest.requireActual('../../hooks/useMathJax').typesetStates,
  useMathJaxScanElement: () => ({
    mathJaxElem: mockMathJaxElem,
    typesetState: mockTypesetState,
  }),
}))

describe('<Content />', () => {
  beforeEach(() => {
    mockApp = { language: 'en' }
    mockCurrentSection = {
      content: { en: [{ t: 'Str', c: 'A nice string' }] },
      id: 'foo',
      ord: [0],
      title: { en: 'Foo section' },
    }
    mockCurrentSubsections = [
      {
        content: { en: [] },
        id: 'bar-1',
        ord: [0, 0],
        title: { en: 'Bar section 1' },
      },
      {
        content: { en: [] },
        id: 'bar-2',
        ord: [0, 1],
        title: { en: 'Bar section 2' },
      },
    ]
    mockCurrentTitle = '1 Foo section'
    mockMathJaxElem = React.createRef()
    mockTypesetState = typesetStates.PENDING
  })

  it('should render', () => {
    const wrapper = shallow(<Content />)
    expect(wrapper.find(SectionNav)).toHaveLength(1)
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
    expect(wrapper.find('h1').text()).toEqual('1 Foo section')
    expect(wrapper.find(ContentFragment).prop('content')).toBe(mockCurrentSection.content.en)
    expect(wrapper.exists(SubsectionList)).toBe(true)
  })

  describe('fade in/out', () => {
    it.each([
      ['in', typesetStates.SUCCESS, false],
      ['out', typesetStates.PENDING, true],
    ])('should fade %s', (_, state, hidePresent) => {
      mockTypesetState = state
      const wrapper = shallow(<Content />)
      expect(wrapper.find('div').at(0).hasClass(fadeInCss.hide)).toBe(hidePresent)
      expect(wrapper.find('div').at(0).hasClass(fadeInCss.show)).toBe(!hidePresent)
    })
  })

  describe('missing data', () => {
    it('should render without sections', () => {
      mockCurrentSection = { content: {} }
      mockCurrentSubsections = []
      const wrapper = shallow(<Content />)
      expect(wrapper.exists(SubsectionList)).toBe(false)
      expect(wrapper.exists(ContentFragment)).toBe(false)
    })

    it('should render without content', () => {
      mockCurrentSection = {
        content: {},
        id: 'foo',
        ord: [0],
        title: { en: 'Foo section' },
      }
      const wrapper = shallow(<Content />)
      expect(wrapper.exists(SubsectionList)).toBe(true)
      expect(wrapper.exists(ContentFragment)).toBe(false)
    })

    it('should render without language', () => {
      mockApp = {}
      const wrapper = shallow(<Content />)
      expect(wrapper.exists(SubsectionList)).toBe(true)
      expect(wrapper.exists(ContentFragment)).toBe(false)
    })
  })
})