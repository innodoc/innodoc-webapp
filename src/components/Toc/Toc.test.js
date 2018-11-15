import React from 'react'
import { shallow } from 'enzyme'
import Tree from 'antd/lib/tree'

import { Toc } from './Toc'
import ContentFragment from '../content/ContentFragment'

describe('<Toc />', () => {
  const toc = [
    {
      id: 'section-1',
      title: { en: [{ t: 'Str', c: 'Section 1' }] },
      children: [
        {
          id: 'section-1/section-1-1',
          title: { en: [{ t: 'Str', c: 'Section 1-1' }] },
          children: [
            {
              id: 'section-1/section-1-1/section-1-1-1',
              title: { en: [{ t: 'Str', c: 'Section 1-1-1' }] },
            },
          ],
        },
      ],
    },
    {
      id: 'section-2',
      title: { en: [{ t: 'Str', c: 'Section 2' }] },
    },
  ]

  it('renders tree nodes', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
        header={['Foobar']}
      />
    )
    expect(wrapper.find(Tree)).toExist()
    expect(wrapper.find(Tree.TreeNode)).toHaveLength(4)
  })

  it('renders with header', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
        header={(<ContentFragment content={['Foobar']} />)}
      />
    )
    expect(wrapper.find('h2').find('ContentFragment')).toHaveLength(1)
    expect(wrapper.find('h2').find('ContentFragment').prop('content')).toEqual(['Foobar'])
  })

  it('renders with active section', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
        currentSectionId="section-1/section-1-1"
      />
    )
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(1)
  })

  it('renders without active section', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
      />
    )
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(0)
  })

  it('can expand all', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
        expandAll
      />
    )
    expect(wrapper.find(Tree).prop('defaultExpandAll')).toBe(true)
  })

  it('expands current section from within tree component', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
      />
    )
    expect(wrapper.state('expandedKeys')).toHaveLength(0)
    wrapper.instance().onExpand(['section-1/section-1-1'])
    expect(wrapper.state('expandedKeys')).toEqual(['section-1/section-1-1'])
  })

  it('expands current section from outside tree component', () => {
    const wrapper = shallow(
      <Toc
        toc={toc}
        currentLanguage="en"
      />
    )
    expect(wrapper.state('expandedKeys')).toHaveLength(0)
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(0)
    wrapper.setProps({ currentSectionId: 'section-1/section-1-1/section-1-1-1' })
    expect(wrapper.find(Tree.TreeNode).filter('.active')).toHaveLength(1)
    expect(wrapper.state('expandedKeys')).toHaveLength(3)
    expect(wrapper.state('expandedKeys')).toEqual(expect.arrayContaining(
      ['section-1'],
      ['section-1/section-1-1'],
      ['section-1/section-1-1-1'],
    ))
  })
})
