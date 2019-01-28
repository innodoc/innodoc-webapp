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
  getSubsections: () => [],
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
    expect(wrapper.find('h2')).toHaveLength(1)
    expect(wrapper.find('ul')).toHaveLength(1)
    const subsections = wrapper.find('ul > li')
    expect(subsections).toHaveLength(2)
    expect(subsections.at(0).find('a').text()).toEqual(data.subsections[0].title.en)
    expect(subsections.at(1).find('a').text()).toEqual(data.subsections[1].title.en)
  })

  it('renders and updates', () => {
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
    expect(wrapper.find('h1').text()).toEqual(data.otherSection.title.en)
    expect(wrapper.find(ContentFragment).at(0).prop('content')).toEqual(data.otherSection.content.en)
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
      subsections: [],
      currentLanguage: 'en',
      loading: false,
    })
  })
})
