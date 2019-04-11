import React from 'react'
import { shallow } from 'enzyme'

import Strikeout from './Strikeout'
import ContentFragment from '../ContentFragment'

const content = [
  { t: 'Str', c: 'Foo' },
]

describe('<Strikeout />', () => {
  it('should render', () => {
    const wrapper = shallow(<Strikeout data={content} />)
    expect(wrapper.find('s')).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(content)
  })
})
