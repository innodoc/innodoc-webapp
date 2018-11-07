import React from 'react'
import { shallow } from 'enzyme'
import Collapse from 'antd/lib/collapse'

import { SolutionHint } from './SolutionHint'
import ContentFragment from '..'

describe('<Card />', () => {
  it('renders', () => {
    const content = [{ t: 'Str', c: 'Bar' }]
    const wrapper = shallow(<SolutionHint t={() => {}} content={content} />)
    expect(wrapper.find(Collapse)).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toBe(content)
  })
})
