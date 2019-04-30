import React from 'react'
import { shallow } from 'enzyme'

import { Content, mapStateToProps } from './Content'
import SubsectionList from './SubsectionList'
import Breadcrumb from '../Breadcrumb'
import ContentFragment from '../ContentFragment'
import SectionNav from '../SectionNav'

let mockGetCurrentCourseMock
let mockGetCurrentSectionMock

jest.mock('../../../store/selectors/index.js', () => ({
  getApp: () => ({ language: 'en' }),
  getOrmState: () => ({ orm: {} }),
}))
jest.mock('../../../store/selectors/course.js', () => ({
  getCurrentCourse: () => mockGetCurrentCourseMock(),
}))
jest.mock('../../../store/selectors/section/index.js', () => ({
  getCurrentSection: () => mockGetCurrentSectionMock(),
  getCurrentSubsections: () => [],
}))

describe('<Content />', () => {
  const getData = () => ({
    mockTypesetMathJax: jest.fn(),
    mockT: jest.fn(),
    section: {
      id: 'foo',
      title: { en: 'Foo section' },
      content: { en: [{ t: 'Str', c: 'A nice string' }] },
    },
    subsections: [
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
    ],
    otherSection: {
      id: 'bar',
      title: { en: 'Bar section' },
      content: { en: [{ t: 'Str', c: 'An awesome string' }] },
    },
    contentRef: React.createRef(),
  })

  it('renders', () => {
    const data = getData()
    const wrapper = shallow(
      <Content
        section={data.section}
        subsections={data.subsections}
        sectionLevel={1}
        typesetMathJax={data.mockTypesetMathJax}
        mathJaxContentRef={data.contentRef}
        currentLanguage="en"
        t={data.mockT}
      />
    )
    expect(data.mockTypesetMathJax).toBeCalledTimes(1)
    expect(wrapper.find(SectionNav)).toHaveLength(1)
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
    const contentDiv = wrapper.find('div')
    expect(contentDiv).toHaveLength(1)
    const h1 = wrapper.find('h1')
    expect(h1).toHaveLength(1)
    expect(h1.text()).toEqual(data.section.title.en)
    expect(wrapper.find(ContentFragment).at(0).prop('content')).toEqual(data.section.content.en)
    expect(wrapper.exists(SubsectionList)).toBe(true)
  })

  it('renders and updates', () => {
    const data = getData()
    const wrapper = shallow(
      <Content
        section={data.section}
        subsections={[]}
        sectionLevel={1}
        typesetMathJax={data.mockTypesetMathJax}
        mathJaxContentRef={data.contentRef}
        currentLanguage="en"
        t={data.mockT}
      />
    )
    const spyComponentDidUpdate = jest.spyOn(wrapper.instance(), 'componentDidUpdate')
    expect(data.mockTypesetMathJax).toBeCalledTimes(1)
    wrapper.setProps({
      section: data.otherSection,
      sectionLevel: 2,
    })
    expect(spyComponentDidUpdate).toBeCalledTimes(1)
    expect(data.mockTypesetMathJax).toBeCalledTimes(2)
    expect(wrapper.exists(SectionNav)).toBe(true)
    expect(wrapper.exists(Breadcrumb)).toBe(true)
    expect(wrapper.exists(SubsectionList)).toBe(false)
    const contentDiv = wrapper.find('div')
    expect(contentDiv).toHaveLength(1)
    const h1 = wrapper.find('h1')
    expect(h1).toHaveLength(1)
    expect(h1.text()).toEqual(data.otherSection.title.en)
    expect(wrapper.find(ContentFragment).at(0).prop('content')).toEqual(data.otherSection.content.en)
  })
})

describe('mapStateToProps', () => {
  it("returns loading=true if there's no current section id", () => {
    mockGetCurrentCourseMock = () => ({
      currentSection: null,
      homeLink: 'foo',
      languages: ['en'],
      title: ['Foobar'],
    })
    mockGetCurrentSectionMock = () => undefined
    expect(mapStateToProps().loading).toEqual(true)
  })

  it("returns loading=true if there's no section returned", () => {
    mockGetCurrentCourseMock = () => ({
      currentSection: 'foo',
      homeLink: 'foo',
      languages: ['en'],
      title: ['Foobar'],
    })
    mockGetCurrentSectionMock = () => undefined
    expect(mapStateToProps().loading).toEqual(true)
  })

  it("returns loading=false if there's a current section", () => {
    const section = { id: 'foo', title: { en: ['title'] }, content: { en: ['foocontent'] } }
    mockGetCurrentCourseMock = () => ({
      currentSection: 'foo',
      homeLink: 'foo',
      languages: ['en'],
      title: ['Foobar'],
    })
    mockGetCurrentSectionMock = () => section
    expect(mapStateToProps()).toEqual({
      section,
      subsections: [],
      currentLanguage: 'en',
      loading: false,
    })
  })
})
