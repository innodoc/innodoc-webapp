import React from 'react'
import { shallow } from 'enzyme'

import { Question, mapStateToProps } from './Question'
import InputQuestion from './InputQuestion'
import CheckboxQuestion from './CheckboxQuestion'

// TODO: once enzyme support hooks, this should be extended to
// consider useContext(ExerciseContext)

describe('<Question />', () => {
  it.each([
    ['text', InputQuestion],
    ['checkbox', CheckboxQuestion],
  ])('should map className ("%s") to correct Component', (className, Component) => {
    const wrapper = shallow(
      <Question
        attributes={[]}
        questionClasses={[className]}
        questionId="foo/bar#EX01"
        onChange={() => {}}
      />
    )
    expect(wrapper.is(Component)).toBe(true)
  })

  it('should render unknownQuestion for unknown component className', () => {
    const wrapper = shallow(
      <Question
        attributes={[]}
        questionClasses={['this-component-does-not-exist']}
        questionId="foo/bar#EX01"
        onChange={() => {}}
      />
    )
    expect(wrapper.hasClass('unknownQuestion')).toBe(true)
  })

  it('should render and dispatch on change', () => {
    const onChange = jest.fn()
    const wrapper = shallow(
      <Question
        answer="41"
        correct={false}
        attributes={[['fooKey', 'fooValue']]}
        questionClasses={['text']}
        questionId="foo/bar#EX01"
        onChange={onChange}
      />
    )
    expect(wrapper.prop('value')).toBe('41')
    wrapper.prop('onChange')('42')
    expect(onChange).toBeCalledWith({
      questionId: 'foo/bar#EX01',
      attributes: { fooKey: 'fooValue' },
      answer: '42',
    })
  })
})

jest.mock('../../../../store/selectors/index.js', () => ({
  getApp: () => ({ language: 'en' }),
  getOrmState: () => ({ orm: {} }),
}))

jest.mock('../../../../store/selectors/section/index.js', () => ({
  getCurrentSection: () => ({ id: 'foo/bar' }),
}))

let mockGetQuestion = () => null
jest.mock('../../../../store/selectors/question.js', () => ({
  getQuestion: () => mockGetQuestion(),
}))

describe('mapStateToProps', () => {
  it('should prefix id', () => {
    expect(mapStateToProps(null, { id: 'EX0' }).questionId).toBe('foo/bar#EX0')
  })

  it('should return question details', () => {
    mockGetQuestion = () => ({ answer: '42', correct: false })
    const props = mapStateToProps(null, { id: 'EX0' })
    expect(props.answer).toEqual('42')
    expect(props.correct).toBe(false)
  })

  it('should not return details if question is not there', () => {
    mockGetQuestion = () => null
    const props = mapStateToProps(null, { id: 'EX0' })
    expect(props).not.toHaveProperty('answer')
    expect(props).not.toHaveProperty('correct')
  })
})
