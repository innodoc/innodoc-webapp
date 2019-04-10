import React from 'react'
import { shallow } from 'enzyme'

import Emph from './Emph'
import ContentFragment from '../ContentFragment'

const content = [
  { t: 'Str', c: 'Foo' },
]

describe('<Emph />', () => {
  it('should render', () => {
    const wrapper = shallow(<Emph data={content} />)
    expect(wrapper.find('em')).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(content)
  })
})
