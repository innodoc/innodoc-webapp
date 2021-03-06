import React from 'react'
import { shallow } from 'enzyme'
import { Typography } from 'antd'

import Strong from './Strong'
import ContentFragment from '../ContentFragment'

jest.mock('@innodoc/common/src/i18n')

const content = [{ t: 'Str', c: 'Foo' }]

describe('<Strong />', () => {
  it('should render', () => {
    const wrapper = shallow(<Strong data={content} />)
    expect(wrapper.find(Typography.Text).prop('strong')).toBe(true)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(content)
  })
})
