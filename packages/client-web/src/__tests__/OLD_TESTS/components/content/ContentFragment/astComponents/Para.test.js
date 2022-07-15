import React from 'react'
import { shallow } from 'enzyme'
import { Typography } from 'antd'

import Para from './Para'
import ContentFragment from '../ContentFragment'

jest.mock('@innodoc/common/src/i18n')

const content = [{ t: 'Str', c: 'Foo' }]

describe('<Para />', () => {
  it('should render', () => {
    const wrapper = shallow(<Para data={content} />)
    expect(wrapper.find(Typography.Paragraph)).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(content)
  })
})
