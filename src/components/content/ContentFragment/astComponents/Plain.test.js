import React from 'react'
import { shallow } from 'enzyme'

import Plain from './Plain'
import ContentFragment from '../ContentFragment'

const content = [
  { t: 'Str', c: 'Foo' },
]

describe('<Plain />', () => {
  it('should render', () => {
    const wrapper = shallow(<Plain data={content} />)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(content)
  })
})
