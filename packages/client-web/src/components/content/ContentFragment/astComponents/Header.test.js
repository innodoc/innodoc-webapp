import React from 'react'
import { shallow } from 'enzyme'
import { Typography } from 'antd'

import Header from './Header'
import ContentFragment from '..'

const data = [
  1,
  ['foo-caption', 'caption', null],
  [{ t: 'Str', c: 'foo content' }],
]

describe('<Header />', () => {
  it('should render', () => {
    const wrapper = shallow(<Header data={data} />)
    const header = wrapper.find(Typography.Title)
    expect(header).toHaveLength(1)
    expect(header.prop('id')).toEqual('foo-caption')
    expect(header.hasClass('caption')).toBe(true)
    expect(wrapper.find(ContentFragment).prop('content')).toBe(data[2])
  })
})
