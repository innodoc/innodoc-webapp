import React from 'react'
import { shallow } from 'enzyme'
import { Tree } from 'antd'

import courseSelectors from '@innodoc/client-store/src/selectors/course'

import Toc from './Toc'

jest.mock('@innodoc/common/src/i18n')

const mockGetCurrentCourse = courseSelectors.getCurrentCourse
let mockCurrentCourse
let mockToc

jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockGetCurrentCourse) {
      return mockCurrentCourse
    }
    return mockToc
  },
}))

const course = {
  currentSectionId: null,
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

  it('renders', () => {
    const wrapper = shallow(<Toc />)
    const tree = wrapper.find(Tree)
    expect(tree).toHaveLength(1)
    expect(tree.prop('expandedKeys')).toHaveLength(0)
  })

  it('renders w/o course', () => {
    mockCurrentCourse = null
    mockToc = []
    const wrapper = shallow(<Toc />)
    const tree = wrapper.find(Tree)
    expect(tree).toHaveLength(1)
    expect(tree.prop('expandedKeys')).toHaveLength(0)
  })

  it('can expand all', () => {
    const wrapper = shallow(<Toc expandAll />)
    const tree = wrapper.find(Tree)
    expect(tree.prop('defaultExpandAll')).toBe(true)
    expect(tree.prop('expandedKeys')).toBeFalsy()
  })

  it('expands section from within tree component', () => {
    const wrapper = shallow(<Toc />)
    const tree = wrapper.find(Tree)
    expect(tree.prop('expandedKeys')).toHaveLength(0)
    tree.prop('onExpand')(['section-1/section-1-1'])
    wrapper.update()
    expect(wrapper.find(Tree).prop('expandedKeys')).toHaveLength(1)
  })

  it('expands current section', () => {
    mockCurrentCourse = {
      ...course,
      currentSectionId: 'section-1/section-1-1/section-1-1-1',
    }
    const wrapper = shallow(<Toc />)
    expect(wrapper.find(Tree).prop('expandedKeys')).toEqual(['section-1/section-1-1/section-1-1-1'])
  })
})
