import React from 'react'
import { shallow } from 'enzyme'

import BlockQuote from './BlockQuote'
import ContentFragment from '../ContentFragment'

const content = [
  { t: 'Para', c: ['Foo'] },
]

describe('<BlockQuote />', () => {
  it('should render', () => {
    const wrapper = shallow(<BlockQuote data={content} />)
    expect(wrapper.find('blockquote')).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(content)
  })
})
