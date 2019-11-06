import React from 'react'
import { shallow } from 'enzyme'

import Math from './Math'
import { mathDelimiter } from '../../../../hooks/useMathJax'

jest.mock('../../../../hooks/useMathJax', () => ({
  mathDelimiter: jest.requireActual('../../../../hooks/useMathJax').mathDelimiter,
}))

const getData = (mathType) => [{ t: mathType }, 'x^2']

describe('<Math />', () => {
  it.each([
    ['InlineMath', 'inline'],
    ['DisplayMath', 'display'],
  ])('should render (%s)', (mathType, cls) => {
    const wrapper = shallow(<Math data={getData(mathType)} />)
    const span = wrapper.find('span')
    expect(span).toHaveLength(1)
    expect(span.hasClass('math')).toBe(true)
    expect(span.hasClass(cls)).toBe(true)
    const delims = mathDelimiter[cls]
    expect(span.text()).toBe(`${delims[0]}x^2${delims[1]}`)
  })
})
