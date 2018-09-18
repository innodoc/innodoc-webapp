import React from 'react'
import { shallow } from 'enzyme'
import { Header } from 'semantic-ui-react'

import { Content, mapStateToProps } from './Content'
import Breadcrumb from '../Breadcrumb'
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
  const mockTypesetMathJax = jest.fn()
  const mockT = jest.fn()
  const section = {
    id: 'foo',
    title: [{ t: 'Str', c: 'Foo section' }],
  }
  const sectionChildren = [{
    id: 'bar',
    title: [{ t: 'Str', c: 'Bar section' }],
  }]
  const sectionContent = [{ t: 'Str', c: 'A nice string' }]
  const contentRef = React.createRef()

  it('renders', () => {
    const wrapper = shallow(
      <Content
        section={section}
        sectionContent={sectionContent}
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
  })

  it('renders no TOC for child-less section', () => {
    const wrapper = shallow(
      <Content
        section={section}
        sectionContent={sectionContent}
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
        sectionContent={sectionContent}
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
        sectionContent={sectionContent}
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
