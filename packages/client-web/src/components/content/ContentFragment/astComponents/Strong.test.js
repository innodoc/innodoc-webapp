import React from 'react'
import { shallow } from 'enzyme'

import Strong from './Strong'
import ContentFragment from '../ContentFragment'

const content = [{ t: 'Str', c: 'Foo' }]

describe('<Strong />', () => {
  it('should render', () => {
    const wrapper = shallow(<Strong data={content} />)
    expect(wrapper.find('strong')).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(content)
  })
})
