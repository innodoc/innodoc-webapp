import React from 'react'
import { shallow } from 'enzyme'

import MathJaxDiv from './MathJaxDiv'
import fadeInCss from '../../../../../style/fadeIn.sass'

const { typesetStates } = jest.requireActual('../../../../hooks/useMathJax')

let mockMathJaxElem
let mockTypesetState

jest.mock('../../../../hooks/useMathJax', () => ({
  __esModule: true,
  default: () => ({
    mathJaxElem: mockMathJaxElem,
    typesetState: mockTypesetState,
  }),
  typesetStates: jest.requireActual('../../../../hooks/useMathJax').typesetStates,
}))

describe('<MathJaxDiv />', () => {
  beforeEach(() => {
    mockMathJaxElem = React.createRef()
    mockTypesetState = typesetStates.SUCCESS
  })

  it('should render', () => {
    const wrapper = shallow(<MathJaxDiv texCode="f(x)=x^2" />)
    expect(wrapper.exists('div')).toBe(true)
  })

  describe('fade in/out', () => {
    it.each([
      ['in', typesetStates.SUCCESS, false],
      ['out', typesetStates.PENDING, true],
    ])('should fade %s', (_, state, hidePresent) => {
      mockTypesetState = state
      const wrapper = shallow(<MathJaxDiv texCode="f(x)=x^2" />)
      expect(wrapper.find('div').hasClass(fadeInCss.hide)).toBe(hidePresent)
      expect(wrapper.find('div').hasClass(fadeInCss.show)).toBe(!hidePresent)
    })
  })
})
