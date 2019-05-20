import React from 'react'
import { shallow } from 'enzyme'

import { BareContent as Content, mapStateToProps } from './Content'
import SubsectionList from './SubsectionList'
import Breadcrumb from './Breadcrumb'
import ContentFragment from './ContentFragment'
import SectionNav from './SectionNav'
import { typesettingStates } from '../hoc/withMathJax'

let mockGetCurrentCourseMock
let mockGetCurrentSectionMock
let mockGetCurrentTitle

jest.mock('../../store/selectors/index.js', () => ({
  getApp: () => ({ language: 'en' }),
  getOrmState: () => ({ orm: {} }),
}))

jest.mock('../../store/selectors/course.js', () => ({
  getCurrentCourse: () => mockGetCurrentCourseMock(),
}))

jest.mock('../../store/selectors/section/index.js', () => ({
  getCurrentSection: () => mockGetCurrentSectionMock(),
  getCurrentSubsections: () => [],
  getCurrentTitle: () => mockGetCurrentTitle(),
}))

describe('<Content />', () => {
  const getData = () => ({
    mockTypesetMathJax: jest.fn(),
    mockT: jest.fn(),
    section: {
      content: { en: [{ t: 'Str', c: 'A nice string' }] },
      id: 'foo',
      ord: [0],
      title: { en: 'Foo section' },
    },
    subsections: [
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
    ],
    otherSection: {
      content: { en: [{ t: 'Str', c: 'An awesome string' }] },
      id: 'bar',
      ord: [1],
      title: { en: 'Bar section' },
    },
    contentRef: React.createRef(),
  })

  it('renders without section and currentLanguage', () => {
    const data = getData()
    const wrapper = shallow(
      <Content
        loading={false}
        mathJaxContentRef={data.contentRef}
        t={data.mockT}
        typesetMathJax={data.mockTypesetMathJax}
        typesettingStatus={typesettingStates.PENDING}
      />
    )
    expect(wrapper.exists(SubsectionList)).toBe(false)
    expect(wrapper.exists(ContentFragment)).toBe(false)
  })

  it('renders', () => {
    const data = getData()
    const wrapper = shallow(
      <Content
        currentLanguage="en"
        loading={false}
        mathJaxContentRef={data.contentRef}
        section={data.section}
        subsections={data.subsections}
        t={data.mockT}
        title="1 Foo section"
        typesetMathJax={data.mockTypesetMathJax}
        typesettingStatus={typesettingStates.PENDING}
      />
    )
    expect(wrapper.find(SectionNav)).toHaveLength(1)
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
    const h1 = wrapper.find('h1')
    expect(h1).toHaveLength(1)
    expect(h1.text()).toEqual('1 Foo section')
    expect(wrapper.find(ContentFragment).at(0).prop('content')).toEqual(data.section.content.en)
    expect(wrapper.exists(SubsectionList)).toBe(true)
    expect(data.mockTypesetMathJax).toBeCalledTimes(0)
  })

  it('renders and updates', () => {
    const data = getData()
    const wrapper = shallow(
      <Content
        currentLanguage="en"
        loading={false}
        mathJaxContentRef={data.contentRef}
        section={data.section}
        subsections={data.subsections}
        t={data.mockT}
        typesetMathJax={data.mockTypesetMathJax}
        typesettingStatus={typesettingStates.PENDING}
      />
    )
    const spyComponentDidUpdate = jest.spyOn(wrapper.instance(), 'componentDidUpdate')
    expect(data.mockTypesetMathJax).toBeCalledTimes(0)
    wrapper.setProps({ section: data.otherSection })
    expect(spyComponentDidUpdate).toBeCalledTimes(1)
    expect(data.mockTypesetMathJax).toBeCalledTimes(1)
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
    mockGetCurrentTitle = () => undefined
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
    mockGetCurrentTitle = () => undefined
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
    mockGetCurrentTitle = () => '1.1 title'
    expect(mapStateToProps()).toEqual({
      section,
      subsections: [],
      currentLanguage: 'en',
      loading: false,
      title: '1.1 title',
    })
  })
})
