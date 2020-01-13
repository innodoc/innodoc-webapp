import React from 'react'
import { shallow } from 'enzyme'
import MathJax from '@innodoc/react-mathjax-node'

import Math from './Math'

const getData = (mathType) => [{ t: mathType }, 'x^2']

describe('<Math />', () => {
  it.each(['InlineMath', 'DisplayMath'])('should render (%s)', (mathType) => {
    const wrapper = shallow(<Math data={getData(mathType)} />)
    const ExpectedComponent =
      mathType === 'InlineMath' ? MathJax.Span : MathJax.Div
    const component = wrapper.find(ExpectedComponent)
    expect(component).toHaveLength(1)
    expect(component.prop('texCode')).toBe('x^2')
  })
})
