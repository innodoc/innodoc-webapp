import React from 'react'
import { shallow } from 'enzyme'
import { Typography } from 'antd'

import Header from './Header'
import ContentFragment from '..'

jest.mock('@innodoc/common/src/i18n')

describe('<Header />', () => {
  it('should render', () => {
    const data = [1, ['foo-caption', 'caption', null], [{ t: 'Str', c: 'foo content' }]]
    const wrapper = shallow(<Header data={data} />)
    const header = wrapper.find(Typography.Title)
    expect(header).toHaveLength(1)
    expect(header.prop('id')).toEqual('foo-caption')
    expect(header.prop('level')).toEqual(1)
    expect(header.hasClass('caption')).toBe(true)
    expect(wrapper.find(ContentFragment).prop('content')).toBe(data[2])
  })

  it('should not accept heading level > 4', () => {
    const data = [5, ['foo-caption', 'caption', null], [{ t: 'Str', c: 'foo content' }]]
    const wrapper = shallow(<Header data={data} />)
    const header = wrapper.find(Typography.Title)
    expect(header.prop('level')).toEqual(4)
  })
})
