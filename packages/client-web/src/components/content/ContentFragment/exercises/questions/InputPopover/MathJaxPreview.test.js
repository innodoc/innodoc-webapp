import React from 'react'
import { shallow } from 'enzyme'

import MathJax from '@innodoc/react-mathjax-node'

import MathJaxPreview from './MathJaxPreview'

describe('<MathJaxPreview />', () => {
  it('should render', () => {
    const wrapper = shallow(<MathJaxPreview texCode="x^2" />)
    const node = wrapper.find(MathJax.MathJaxNode)
    expect(node.prop('displayType')).toBe('display')
    expect(node.prop('texCode')).toBe('x^2')
  })

  it('should render empty with empty texCode', () => {
    const wrapper = shallow(<MathJaxPreview texCode="" />)
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})
