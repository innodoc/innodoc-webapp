import React from 'react'
import { shallow } from 'enzyme'

import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'
import MathJax from './MathJax'

const { typesetStates } = jest.requireActual('../../../../../hooks/useMathJax')

let mockMathJaxElem
let mockTypesetState

jest.mock('../../../../../hooks/useMathJax', () => ({
  __esModule: true,
  default: () => ({
    mathJaxElem: mockMathJaxElem,
    typesetState: mockTypesetState,
  }),
  typesetStates: jest.requireActual('../../../../../hooks/useMathJax').typesetStates,
}))

describe('<MathJax />', () => {
  beforeEach(() => {
    mockMathJaxElem = React.createRef()
    mockTypesetState = typesetStates.SUCCESS
  })

  it('should render', () => {
    const wrapper = shallow(<MathJax texCode="f(x)=x^2" />)
    expect(wrapper.exists('div')).toBe(true)
  })

  describe('fade in/out', () => {
    it.each([
      ['in', typesetStates.SUCCESS, false],
      ['out', typesetStates.PENDING, true],
    ])('should fade %s', (_, state, hidePresent) => {
      mockTypesetState = state
      const wrapper = shallow(<MathJax texCode="f(x)=x^2" />)
      expect(wrapper.find('div').hasClass(fadeInCss.hide)).toBe(hidePresent)
      expect(wrapper.find('div').hasClass(fadeInCss.show)).toBe(!hidePresent)
    })
  })
})
