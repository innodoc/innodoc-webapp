import React from 'react'
import { shallow } from 'enzyme'
import { EllipsisOutlined } from '@ant-design/icons'

import MathJax from '@innodoc/react-mathjax-node'

import MathJaxPreview from './MathJaxPreview'

describe('<MathJaxPreview />', () => {
  it('should render', () => {
    const wrapper = shallow(<MathJaxPreview texCode="x^2" />)
    const node = wrapper.find(MathJax.MathJaxNode)
    expect(node.prop('displayType')).toBe('display')
    expect(node.prop('texCode')).toBe('x^2')
    expect(wrapper.exists(EllipsisOutlined)).toBe(false)
  })

  it('should render <EllipsisOutlined /> with empty texCode', () => {
    const wrapper = shallow(<MathJaxPreview texCode="" />)
    expect(wrapper.exists(EllipsisOutlined)).toBe(true)
    expect(wrapper.exists(MathJax.MathJaxNode)).toBe(false)
  })
})
