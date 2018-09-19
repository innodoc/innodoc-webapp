import React from 'react'
import { shallow } from 'enzyme'
import { Header } from 'semantic-ui-react'

import { Content, mapStateToProps } from './Content'
import Breadcrumb from '../Breadcrumb'
import ContentFragment from '../ContentFragment'
import SectionNav from '../SectionNav'
import Toc from '../../Toc'

let mockyGetCurrentSectionPath
let mockyGetSection
let mockyGetSectionContent
let mockyGetSectionLevel
jest.mock('../../../store/selectors/content.js', () => ({
  getCurrentSectionPath: () => mockyGetCurrentSectionPath(),
  getSection: () => mockyGetSection(),
  getSectionContent: () => mockyGetSectionContent(),
  getSectionLevel: () => mockyGetSectionLevel(),
}))

describe('<Content />', () => {
  let mockTypesetMathJax
  let mockT
  let section
  let sectionChildren
  let content
  let contentRef

  beforeEach(() => {
    mockTypesetMathJax = jest.fn()
    mockT = jest.fn()
    section = {
      id: 'foo',
      title: [{ t: 'Str', c: 'Foo section' }],
    }
    sectionChildren = [{
      id: 'bar',
      title: [{ t: 'Str', c: 'Bar section' }],
    }]
    content = [{ t: 'Str', c: 'A nice string' }]
    contentRef = React.createRef()
  })

  it('renders', () => {
    const wrapper = shallow(
      <Content
        section={section}
        content={content}
        sectionLevel={1}
        typesetMathJax={mockTypesetMathJax}
        mathJaxContentRef={contentRef}
        t={mockT}
      />
    )
    expect(mockTypesetMathJax).toBeCalledTimes(1)
    expect(wrapper.find(SectionNav)).toHaveLength(1)
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
    expect(wrapper.find(Header)).toHaveLength(1)
    const contentDiv = wrapper.find('div')
    expect(contentDiv).toHaveLength(1)
    expect(wrapper.find(ContentFragment).at(0).prop('content')).toEqual(section.title)
    expect(wrapper.find(ContentFragment).at(1).prop('content')).toEqual(content)
  })

  it('renders and updates', () => {
    const wrapper = shallow(
      <Content
        section={section}
        content={content}
        sectionLevel={1}
        typesetMathJax={mockTypesetMathJax}
        mathJaxContentRef={contentRef}
        t={mockT}
      />
    )
    const spyComponentDidUpdate = jest.spyOn(wrapper.instance(), 'componentDidUpdate')
    expect(mockTypesetMathJax).toBeCalledTimes(1)
    const newContent = [{ t: 'Str', c: 'An awesome string' }]
    wrapper.setProps({
      section: sectionChildren[0],
      content: newContent,
      sectionLevel: 2,
    })
    expect(spyComponentDidUpdate).toBeCalledTimes(1)
    expect(mockTypesetMathJax).toBeCalledTimes(2)
    expect(wrapper.find(SectionNav)).toHaveLength(1)
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
    expect(wrapper.find(Header)).toHaveLength(1)
    const contentDiv = wrapper.find('div')
    expect(contentDiv).toHaveLength(1)
    expect(wrapper.find(ContentFragment).at(0).prop('content')).toEqual(sectionChildren[0].title)
    expect(wrapper.find(ContentFragment).at(1).prop('content')).toEqual(newContent)
  })

  it('renders no TOC for child-less section', () => {
    const wrapper = shallow(
      <Content
        section={section}
        content={content}
        sectionLevel={1}
        typesetMathJax={mockTypesetMathJax}
        mathJaxContentRef={contentRef}
        t={mockT}
      />
    )
    expect(wrapper.find(Toc)).toHaveLength(0)
  })

  it.each([1, 2])('renders TOC for level %d section with children', (level) => {
    const wrapper = shallow(
      <Content
        section={{ ...section, children: sectionChildren }}
        content={content}
        sectionLevel={level}
        typesetMathJax={mockTypesetMathJax}
        mathJaxContentRef={contentRef}
        t={mockT}
      />
    )
    const toc = wrapper.find(Toc)
    expect(toc).toHaveLength(1)
    expect(toc.prop('sectionPrefix')).toEqual('foo/')
    expect(toc.prop('toc')).toEqual(sectionChildren)
  })

  it('renders no TOC for level 3 section with children', () => {
    const wrapper = shallow(
      <Content
        section={{ ...section, children: sectionChildren }}
        content={content}
        sectionLevel={3}
        typesetMathJax={mockTypesetMathJax}
        mathJaxContentRef={contentRef}
        t={mockT}
      />
    )
    expect(wrapper.find(Toc)).toHaveLength(0)
  })
})

describe('mapStateToProps', () => {
  it("returns loading=true if there's no current section path", () => {
    mockyGetCurrentSectionPath = () => undefined
    mockyGetSection = () => undefined
    expect(mapStateToProps().loading).toEqual(true)
  })

  it("returns loading=true if there's no section returned", () => {
    mockyGetCurrentSectionPath = () => 'foo'
    mockyGetSection = () => undefined
    expect(mapStateToProps().loading).toEqual(true)
  })

  it("returns loading=false if there's a current section", () => {
    mockyGetCurrentSectionPath = () => 'foo'
    mockyGetSection = () => ({ id: 'foo', title: ['title'] })
    mockyGetSectionContent = () => ['foocontent']
    mockyGetSectionLevel = () => 1
    expect(mapStateToProps()).toEqual({
      loading: false,
      section: ({ id: 'foo', title: ['title'] }),
      content: ['foocontent'],
      sectionLevel: 1,
    })
  })
})
