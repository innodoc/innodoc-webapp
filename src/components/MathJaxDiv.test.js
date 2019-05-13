import React from 'react'
import { mount } from 'enzyme'

import { mathDelimiter, typesettingStates } from './hoc/withMathJax'
import { BareMathJaxDiv as MathJaxDiv } from './MathJaxDiv'
import fadeInCss from '../style/fadeIn.sass'

describe('<MathJaxDiv />', () => {
  let updateMathJax

  beforeEach(() => {
    updateMathJax = jest.fn()
  })

  it('renders successful typeset', () => {
    const wrapper = mount(
      <MathJaxDiv
        mathJaxContentRef={React.createRef()}
        typesettingStatus={typesettingStates.SUCCESS}
        updateMathJax={updateMathJax}
        userInput="foo"
      />
    )
    const div = wrapper.find('div')
    expect(div.hasClass(fadeInCss.show)).toBe(true)
    expect(div.text()).toEqual(`${mathDelimiter.inline[0]}foo${mathDelimiter.inline[1]}`)
  })

  it('renders erroneous typeset', () => {
    const wrapper = mount(
      <MathJaxDiv
        mathJaxContentRef={React.createRef()}
        typesettingStatus={typesettingStates.ERROR}
        updateMathJax={updateMathJax}
        userInput="foo"
      />
    )
    const div = wrapper.find('div')
    expect(div.hasClass(fadeInCss.hide)).toBe(true)
  })

  it('renders without userInput', () => {
    const wrapper = mount(
      <MathJaxDiv
        mathJaxContentRef={React.createRef()}
        typesettingStatus={typesettingStates.SUCCESS}
        updateMathJax={updateMathJax}
      />
    )
    const div = wrapper.find('div')
    expect(div.text()).toEqual(`${mathDelimiter.inline[0]}${mathDelimiter.inline[1]}`)
  })

  it('updates typeset', () => {
    const wrapper = mount(
      <MathJaxDiv
        mathJaxContentRef={React.createRef()}
        typesettingStatus={typesettingStates.SUCCESS}
        updateMathJax={updateMathJax}
        userInput="foo"
      />
    )
    const div = wrapper.find('div')
    expect(div.text()).toEqual(`${mathDelimiter.inline[0]}foo${mathDelimiter.inline[1]}`)
    wrapper.setProps({ userInput: 'bar' })
    expect(updateMathJax).toBeCalledTimes(1)
    expect(updateMathJax).toBeCalledWith(0, 'bar')
  })
})
