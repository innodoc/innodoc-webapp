import React from 'react'
import { shallow } from 'enzyme'
import Tree from 'antd/es/tree'

import courseSelectors from '@innodoc/client-store/src/selectors/course'

import Toc from './Toc'

const mockGetCurrentCourse = courseSelectors.getCurrentCourse
let mockCurrentCourse
let mockToc

jest.mock('react-redux', () => ({
  useSelector: (selector) => (
    selector === mockGetCurrentCourse
      ? mockCurrentCourse
      : mockToc
  ),
}))

const course = {
  currentSection: null,
  homeLink: '/section/section-1',
  languages: ['en'],
  title: { en: 'Foobar' },
}

const toc = [
  {
    id: 'section-1',
    title: { en: 'Section 1' },
    children: [
      {
        id: 'section-1/section-1-1',
        title: { en: 'Section 1-1' },
        children: [
          {
            id: 'section-1/section-1-1/section-1-1-1',
            title: { en: 'Section 1-1-1' },
          },
        ],
      },
    ],
  },
  {
    id: 'section-2',
    title: { en: 'Section 2' },
  },
]

describe('<Toc />', () => {
  beforeEach(() => {
    mockCurrentCourse = course
    mockToc = toc
  })

  it('renders tree nodes', () => {
    const wrapper = shallow(<Toc />)
    expect(wrapper.find(Tree)).toHaveLength(1)
    const treeNodes = wrapper.find(Tree.TreeNode)
    expect(treeNodes).toHaveLength(4)
  })

  it('renders with active section', () => {
    mockCurrentCourse = {
      ...course,
      currentSection: 'section-1/section-1-1',
    }
    const wrapper = shallow(<Toc />)
    const treeNodes = wrapper.find(Tree.TreeNode)
    expect(treeNodes).toHaveLength(4)
    expect(treeNodes.filter('.active')).toHaveLength(1)
  })

  it('renders without active section', () => {
    const wrapper = shallow(<Toc />)
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(0)
  })

  it('can expand all', () => {
    const wrapper = shallow(<Toc expandAll />)
    expect(wrapper.find(Tree).prop('defaultExpandAll')).toBe(true)
  })

  it('expands current section from within tree component', () => {
    const wrapper = shallow(<Toc />)
    const tree = wrapper.find(Tree)
    expect(tree.prop('expandedKeys')).toHaveLength(0)
    tree.prop('onExpand')(['section-1/section-1-1'])
    wrapper.update()
    expect(wrapper.find(Tree).prop('expandedKeys')).toHaveLength(1)
  })

  // TODO: should be working once facebook/react#15275 is resolved
  xit('expands current section from outside tree component', () => {
    const wrapper = shallow(<Toc />)
    let tree = wrapper.find(Tree)
    expect(tree.prop('expandedKeys')).toHaveLength(0)
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(0)
    mockCurrentCourse = {
      ...course,
      currentSection: 'section-1/section-1-1/section-1-1-1',
    }
    // tree.prop('onExpand')([])
    wrapper.update()
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(1)
    tree = wrapper.find(Tree)
    expect(tree.prop('expandedKeys')).toEqual([
      ['section-1'],
      ['section-1/section-1-1'],
      ['section-1/section-1-1-1'],
    ])
  })
})
