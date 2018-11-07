import React from 'react'
import { shallow } from 'enzyme'
import AntCard from 'antd/lib/card'
import Icon from 'antd/lib/icon'

import Card from './Card'
import ContentFragment from '..'

describe('<Card />', () => {
  it('renders', () => {
    const content = [{ t: 'Str', c: 'Bar' }]
    const wrapper = shallow(<Card title="foo" iconType="file" cardType="info" content={content} />)
    expect(wrapper.find(AntCard)).toHaveLength(1)
    expect(wrapper.find(ContentFragment)).toHaveLength(1)
    const icon = wrapper.find(AntCard).dive().find(Icon)
    expect(icon).toHaveLength(1)
    expect(icon.prop('type')).toBe('file')
  })
})
