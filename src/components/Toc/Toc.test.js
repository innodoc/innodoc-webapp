import React from 'react'
import { shallow } from 'enzyme'
import Tree from 'antd/lib/tree'

import { Toc } from './Toc'

describe('<Toc />', () => {
  const course = {
    currentSection: null,
    homeLink: 'section-1',
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

  it('renders tree nodes', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
        title={{ en: 'Foobar' }}
      />
    )
    expect(wrapper.find(Tree)).toBeTruthy()
    expect(wrapper.find(Tree.TreeNode)).toHaveLength(4)
  })

  it('renders with header', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
        title={{ en: 'Foobar' }}
      />
    )
    expect(wrapper.find('h2')).toHaveLength(1)
    expect(wrapper.find('h2').text()).toEqual('Foobar')
  })

  it('renders with active section', () => {
    const newCourse = {
      ...course,
      currentSection: 'section-1/section-1-1',
    }

    const wrapper = shallow(
      <Toc
        course={newCourse}
        toc={toc}
        currentLanguage="en"
      />
    )
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(1)
  })

  it('renders without active section', () => {
    const wrapper = shallow(
      <Toc
        course={course}
        toc={toc}
        currentLanguage="en"
      />
    )
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(0)
  })

  it('can expand all', () => {
    const wrapper = shallow(
      <Toc
        course={course}
        toc={toc}
        currentLanguage="en"
        expandAll
      />
    )
    expect(wrapper.find(Tree).prop('defaultExpandAll')).toBe(true)
  })

  it('expands current section from within tree component', () => {
    const newCourse = {
      ...course,
      currentSection: null,
    }

    const wrapper = shallow(
      <Toc
        course={newCourse}
        toc={toc}
        currentLanguage="en"
      />
    )
    expect(wrapper.state('expandedKeys')).toHaveLength(0)
    wrapper.instance().onExpand(['section-1/section-1-1'])
    expect(wrapper.state('expandedKeys')).toEqual(['section-1/section-1-1'])
  })

  it('expands current section from outside tree component', () => {
    const newCourse = {
      ...course,
      currentSection: null,
    }

    const wrapper = shallow(
      <Toc
        course={newCourse}
        toc={toc}
        currentLanguage="en"
      />
    )
    expect(wrapper.state('expandedKeys')).toHaveLength(0)
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(0)
    wrapper.setProps(
      {
        course: {
          ...course,
          currentSection: 'section-1/section-1-1/section-1-1-1',
        },
      })
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(1)
    expect(wrapper.state('expandedKeys')).toHaveLength(3)
    expect(wrapper.state('expandedKeys')).toEqual(expect.arrayContaining(
      ['section-1'],
      ['section-1/section-1-1'],
      ['section-1/section-1-1-1'],
    ))
  })
})
