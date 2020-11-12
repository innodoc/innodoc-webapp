import React from 'react'
import { mount, shallow } from 'enzyme'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import Question from './Question'
import InputQuestion from './InputQuestion'
import CheckboxQuestion from './CheckboxQuestion'
import { ExerciseContext } from '../ExerciseContext'
import css from './style.sss'

jest.mock('@innodoc/common/src/i18n')

let mockQuestion
jest.mock('@innodoc/client-store/src/selectors/question', () => ({
  makeGetQuestion: () => () => mockQuestion,
}))

const mockGetCurrentSection = sectionSelectors.getCurrentSection
const mockSection = { id: 'foo/bar' }
jest.mock('react-redux', () => ({
  useSelector: (selector) => (selector === mockGetCurrentSection ? mockSection : selector()),
}))

let mockAddQuestion
let mockDispatchAnswer
let mockShowResult
const MockProvider = ({ children }) => (
  <ExerciseContext.Provider
    value={{
      addQuestion: mockAddQuestion,
      dispatchAnswer: mockDispatchAnswer,
      showResult: mockShowResult,
    }}
  >
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
    mockAddQuestion = () => {}
    mockDispatchAnswer = () => false
    mockShowResult = true
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
    expect(shallow(<IconComp />).prop('isCorrect')).toBe(result === RESULT_VALUE.CORRECT)
    expect(inputQuestion.prop('showResult')).toBe(true)
    expect(inputQuestion.prop('value')).toBe('42')
  })

  describe('ExerciseContext functions', () => {
    it('should register question', () => {
      mockAddQuestion = jest.fn()
      mount(
        <MockProvider>
          <Question attributes={[['points', '10']]} id="Q99" questionClasses={['text']} />
        </MockProvider>
      )
      expect(mockAddQuestion).toBeCalledTimes(1)
      expect(mockAddQuestion).toBeCalledWith('foo/bar#Q99', 10)
    })

    it.each([['Q91'], [undefined]])('should call dispatchAnswer on change', (qId) => {
      mockDispatchAnswer = jest.fn()
      mockQuestion = { ...mockQuestion, answer: 'foo' }
      const wrapper = mount(
        <MockProvider>
          <Question attributes={[['points', '8']]} id={qId} questionClasses={['text']} />
        </MockProvider>
      )
      wrapper.find(InputQuestion).invoke('onChange')('42')
      expect(mockDispatchAnswer).toBeCalledTimes(1)
      expect(mockDispatchAnswer).toBeCalledWith(expect.stringContaining('foo/bar#'), '42', {
        points: '8',
      })
    })
  })

  describe('showResult', () => {
    it.each([
      [true, RESULT_VALUE.NEUTRAL],
      [true, RESULT_VALUE.CORRECT],
      [true, RESULT_VALUE.INCORRECT],
      [false, RESULT_VALUE.NEUTRAL],
      [false, RESULT_VALUE.CORRECT],
      [false, RESULT_VALUE.INCORRECT],
    ])('should indicate result (showResult=%s, result=%s)', (showResult, result) => {
      mockQuestion = { ...mockQuestion, result }
      mockShowResult = showResult
      const wrapper = mount(
        <MockProvider>
          <Question attributes={[['foo', 'bar']]} id="Q91" questionClasses={['text']} />
        </MockProvider>
      )
      const inputQuestion = wrapper.find(InputQuestion)
      expect(inputQuestion.prop('showResult')).toBe(showResult)
      const IconComp = () => inputQuestion.prop('icon')
      const iconIsCorrect = shallow(<IconComp />).prop('isCorrect')
      if (showResult) {
        expect(iconIsCorrect).toBe(result === RESULT_VALUE.CORRECT)
        expect(inputQuestion.hasClass(css.correct)).toBe(result === RESULT_VALUE.CORRECT)
        expect(inputQuestion.hasClass(css.incorrect)).toBe(result === RESULT_VALUE.INCORRECT)
      } else {
        expect(iconIsCorrect).toBeNull()
        expect(inputQuestion.hasClass(css.correct)).toBe(false)
        expect(inputQuestion.hasClass(css.incorrect)).toBe(false)
      }
    })
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
