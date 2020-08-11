import React from 'react'
import { mount, shallow } from 'enzyme'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import Question from './Question'
import InputQuestion from './InputQuestion'
import CheckboxQuestion from './CheckboxQuestion'
import { ExerciseContext } from '../ExerciseContext'
import css from './style.sss'

let mockQuestion = {}
jest.mock('@innodoc/client-store/src/selectors/question', () => ({
  makeGetQuestion: () => () => mockQuestion,
}))

const mockGetCurrentSection = sectionSelectors.getCurrentSection
const mockSection = { id: 'foo/bar' }
jest.mock('react-redux', () => ({
  useSelector: (selector) => (selector === mockGetCurrentSection ? mockSection : selector()),
}))

let addQuestion
let questionAnswered
let getShowResult
const MockProvider = ({ children }) => (
  <ExerciseContext.Provider value={{ addQuestion, questionAnswered, getShowResult }}>
    {children}
  </ExerciseContext.Provider>
)

describe('<Question />', () => {
  beforeEach(() => {
    mockQuestion = {
      answer: '42',
      result: RESULT_VALUE.NEUTRAL,
      messages: [],
      latexCode: '42',
    }
    addQuestion = () => {}
    questionAnswered = () => false
    getShowResult = () => true
  })

  it.each([
    ['correct', RESULT_VALUE.CORRECT],
    ['incorrect', RESULT_VALUE.INCORRECT],
  ])('should render %s', (correct, result) => {
    mockQuestion = { ...mockQuestion, answer: '42', result }
    const wrapper = mount(
      <MockProvider>
        <Question attributes={[['points', '10']]} id="Q01" questionClasses={['text']} />
      </MockProvider>
    )
    const inputQuestion = wrapper.find(InputQuestion)
    expect(inputQuestion).toHaveLength(1)
    expect(inputQuestion.prop('attributes')).toEqual({ points: '10' })
    const cssCls = correct === 'correct' ? css.correct : css.incorrect
    expect(inputQuestion.hasClass(cssCls)).toBe(true)
    const IconComp = () => inputQuestion.prop('icon')
    expect(shallow(<IconComp />).prop('result')).toBe(result)
    expect(inputQuestion.prop('value')).toBe('42')
  })

  describe('ExerciseContext functions', () => {
    it('should call addQuestion', () => {
      addQuestion = jest.fn()
      mount(
        <MockProvider>
          <Question attributes={[['points', '10']]} id="Q99" questionClasses={['text']} />
        </MockProvider>
      )
      expect(addQuestion).toBeCalledTimes(1)
      expect(addQuestion).toBeCalledWith('foo/bar#Q99', 10)
    })

    it.each([['Q91'], [undefined]])('should call questionAnswered on change', (qId) => {
      questionAnswered = jest.fn()
      mockQuestion = { ...mockQuestion, answer: 'foo' }
      const wrapper = mount(
        <MockProvider>
          <Question attributes={[['points', '8']]} id={qId} questionClasses={['text']} />
        </MockProvider>
      )
      wrapper.find(InputQuestion).invoke('onChange')('42')
      expect(questionAnswered).toBeCalledTimes(1)
      expect(questionAnswered).toBeCalledWith(expect.stringContaining('foo/bar#'), '42', {
        points: '8',
      })
    })
  })

  describe('getShowResult', () => {
    it.each([
      [true, RESULT_VALUE.NEUTRAL, false, undefined],
      [true, RESULT_VALUE.CORRECT, true, css.correct],
      [true, RESULT_VALUE.INCORRECT, true, css.incorrect],
      [false, RESULT_VALUE.NEUTRAL, false, undefined],
      [false, RESULT_VALUE.CORRECT, false, undefined],
      [false, RESULT_VALUE.INCORRECT, false, undefined],
    ])(
      'getShowResult=%s correct=%s showsResult=%s className=%s',
      (getShowResultValue, result, expShowResult, expClassName) => {
        mockQuestion = { ...mockQuestion, answer: 'foo', result }
        getShowResult = () => getShowResultValue
        const wrapper = mount(
          <MockProvider>
            <Question attributes={[['foo', 'bar']]} id="Q91" questionClasses={['text']} />
          </MockProvider>
        )
        const inputQuestion = wrapper.find(InputQuestion)
        if (expShowResult) {
          expect(inputQuestion.hasClass(expClassName)).toBe(true)
        } else {
          expect(inputQuestion.hasClass(css.correct)).toBe(false)
          expect(inputQuestion.hasClass(css.incorrect)).toBe(false)
        }
      }
    )
  })
})

describe('mapClassNameToComponent', () => {
  it.each([
    ['text', InputQuestion],
    ['checkbox', CheckboxQuestion],
  ])('should map className (%s) to correct Component', (className, Component) => {
    const wrapper = shallow(<Question attributes={[]} id="Q01" questionClasses={[className]} />)
    expect(wrapper.is(Component)).toBe(true)
  })

  it('should render unknownQuestion for unknown component className (non-production)', () => {
    const wrapper = shallow(
      <Question attributes={[]} id="Q01" questionClasses={['this-component-does-not-exist']} />
    )
    expect(wrapper.type()).toBe('span')
    expect(wrapper.hasClass(css.unknownQuestion)).toBe(true)
  })

  it('should render empty for unknown component className (production)', () => {
    process.env.NODE_ENV = 'production'
    const wrapper = shallow(
      <Question attributes={[]} id="Q01" questionClasses={['this-component-does-not-exist']} />
    )
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})
