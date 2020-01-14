import React from 'react'
import { shallow } from 'enzyme'
import { Tree } from 'antd'

import renderTreeNode from './renderTreeNode'
import css from './style.sss'

const section = {
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
}

const renderTreeNodeHelper = (_s, _c) => {
  const Helper = ({ s, c }) => renderTreeNode(s, c)
  return shallow(<Helper s={_s} c={_c} />)
}

describe('<TreeNodes />', () => {
  it.each([
    ['with', 'section-1/section-1-1'],
    ['w/o', null],
  ])('should render tree of nodes %s active section', (_, currentSection) => {
    const wrapper = renderTreeNodeHelper(section, currentSection)
    expect(wrapper.find(Tree.TreeNode)).toHaveLength(3)
    expect(wrapper.key()).toBe('section-1')
    expect(wrapper.prop('className')).toBeFalsy()
    expect(wrapper.prop('title').type.name).toBe('ContentLink')
    expect(wrapper.children()).toHaveLength(1)
    const section11 = wrapper.children().first()
    expect(section11.key()).toBe('section-1/section-1-1')
    if (currentSection) {
      expect(section11.prop('className')).toBe(css.active)
      expect(section11.prop('title').type.name).toBe('ActiveSectionLabel')
    } else {
      expect(section11.prop('className')).toBeFalsy()
      expect(section11.prop('title').type.name).toBe('ContentLink')
    }
    expect(section11.children()).toHaveLength(1)
    const section111 = section11.children().first()
    expect(section111.key()).toBe('section-1/section-1-1/section-1-1-1')
    expect(section111.prop('className')).toBeFalsy()
    expect(section111.prop('title').type.name).toBe('ContentLink')
    expect(section111.children()).toHaveLength(0)
  })
})
