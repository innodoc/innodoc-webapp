import React from 'react'
import { shallow } from 'enzyme'

import { Content, mapStateToProps } from './Content'
import Breadcrumb from '../Breadcrumb'
import ContentFragment from '../ContentFragment'
import SectionNav from '../SectionNav'

let mockyGetCurrentCourse
let mockyGetSection

jest.mock('../../../store/selectors/app.js', () => ({
  getLanguage: () => 'en',
}))
jest.mock('../../../store/selectors/course.js', () => ({
  getCurrentCourse: () => mockyGetCurrentCourse(),
}))
jest.mock('../../../store/selectors/section.js', () => ({
  getSection: () => mockyGetSection(),
}))

describe('<Content />', () => {
  const getData = () => ({
    mockTypesetMathJax: jest.fn(),
    mockT: jest.fn(),
    section: {
      id: 'foo',
      title: { en: [{ t: 'Str', c: 'Foo section' }] },
      content: { en: [{ t: 'Str', c: 'A nice string' }] },
    },
    otherSection: {
      id: 'bar',
      title: { en: [{ t: 'Str', c: 'Bar section' }] },
      content: { en: [{ t: 'Str', c: 'An awesome string' }] },
    },
    contentRef: React.createRef(),
  })

  it('renders', () => {
    const data = getData()
    const wrapper = shallow(
      <Content
        section={data.section}
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
    expect(wrapper.find('h1')).toHaveLength(1)
    const contentDiv = wrapper.find('div')
    expect(contentDiv).toHaveLength(1)
    expect(wrapper.find(ContentFragment).at(0).prop('content')).toEqual(data.section.title.en)
    expect(wrapper.find(ContentFragment).at(1).prop('content')).toEqual(data.section.content.en)
  })

  it('renders and updates', () => {
    const data = getData()
    const wrapper = shallow(
      <Content
        section={data.section}
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
    expect(wrapper.find(SectionNav)).toHaveLength(1)
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
    expect(wrapper.find('h1')).toHaveLength(1)
    const contentDiv = wrapper.find('div')
    expect(contentDiv).toHaveLength(1)
    expect(wrapper.find(ContentFragment).at(0).prop('content')).toEqual(data.otherSection.title.en)
    expect(wrapper.find(ContentFragment).at(1).prop('content')).toEqual(data.otherSection.content.en)
  })
})

describe('mapStateToProps', () => {
  it("returns loading=true if there's no current section id", () => {
    mockyGetCurrentCourse = () => ({
      currentSectionId: null,
      homeLink: 'foo',
      languages: ['en'],
      title: ['Foobar'],
    })
    mockyGetSection = () => undefined
    expect(mapStateToProps().loading).toEqual(true)
  })

  it("returns loading=true if there's no section returned", () => {
    mockyGetCurrentCourse = () => ({
      currentSectionId: 'foo',
      homeLink: 'foo',
      languages: ['en'],
      title: ['Foobar'],
    })
    mockyGetSection = () => undefined
    expect(mapStateToProps().loading).toEqual(true)
  })

  it("returns loading=false if there's a current section", () => {
    const section = { id: 'foo', title: { en: ['title'] }, content: { en: ['foocontent'] } }
    mockyGetCurrentCourse = () => ({
      currentSectionId: 'foo',
      homeLink: 'foo',
      languages: ['en'],
      title: ['Foobar'],
    })
    mockyGetSection = () => section
    expect(mapStateToProps()).toEqual({
      section,
      currentLanguage: 'en',
      loading: false,
    })
  })
})
