import React from 'react'
import { shallow } from 'enzyme'
import { Collapse } from 'antd'

import Hint from './Hint'
import ContentFragment from '..'

jest.mock('@innodoc/common/src/i18n')

describe('<Hint />', () => {
  it('renders', () => {
    const attributes = [['caption', 'Solution']]
    const content = [{ t: 'Str', c: 'Bar' }]
    const wrapper = shallow(<Hint attributes={attributes} content={content} />)
    expect(wrapper.find(Collapse)).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toBe(content)
    expect(wrapper.find(Collapse.Panel).prop('header')).toBe('Solution')
  })
})
