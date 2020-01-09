import React from 'react'
import { shallow } from 'enzyme'

import Para from './Para'
import ContentFragment from '../ContentFragment'

const content = [{ t: 'Str', c: 'Foo' }]

describe('<Para />', () => {
  it('should render', () => {
    const wrapper = shallow(<Para data={content} />)
    expect(wrapper.find('p')).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(content)
  })
})
