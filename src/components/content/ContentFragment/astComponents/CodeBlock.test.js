import React from 'react'
import { shallow } from 'enzyme'

import CodeBlock from './CodeBlock'

const content = [
  [null, 'python', null],
  'print("foo")',
]

describe('<CodeBlock />', () => {
  it('should render', () => {
    const wrapper = shallow(<CodeBlock data={content} />)
    expect(wrapper.find('pre')).toHaveLength(1)
    const codeEl = wrapper.find('code')
    expect(codeEl).toHaveLength(1)
    expect(codeEl.prop('className')).toEqual('code-python')
    expect(codeEl.text()).toEqual('print("foo")')
  })
})
