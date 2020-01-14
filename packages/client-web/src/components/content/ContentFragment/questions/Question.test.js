import React from 'react'
import { mount, shallow } from 'enzyme'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import { questionAnswered } from '@innodoc/client-store/src/actions/question'

import FeedbackIcon from './FeedbackIcon'
import Question from './Question'
import InputQuestion from './InputQuestion'
import CheckboxQuestion from './CheckboxQuestion'
import ExerciseContext from '../cards/ExerciseCard/ExerciseContext'
import css from './style.sss'

let mockQuestion = {}
jest.mock('@innodoc/client-store/src/selectors/question', () => ({
  makeGetQuestion: () => () => mockQuestion,
}))

const mockGetCurrentSection = sectionSelectors.getCurrentSection
const mockSection = { id: 'foo/bar' }
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: (selector) =>
    selector === mockGetCurrentSection ? mockSection : selector(),
  useDispatch: () => mockDispatch,
}))

describe('<Question />', () => {
  beforeEach(() => {
    mockQuestion = {}
    mockDispatch.mockClear()
  })

  describe('should dispatch questionAnswered', () => {
    it('with generated question ID', () => {
      const wrapper = shallow(
        <Question attributes={[['foo', 'bar']]} questionClasses={['text']} />
      )
      const questionComponent = wrapper.find(InputQuestion)
      questionComponent.prop('onChange')('42')
      expect(mockDispatch).toBeCalledWith(
        questionAnswered({
          answer: '42',
          attributes: { foo: 'bar' },
          questionId: 'foo/bar#a919274e942118402ebe65d40c483793a494ac01',
        })
      )
    })

    it('with given question ID', () => {
      mockQuestion = { answer: '41', correct: false }
      const wrapper = shallow(
        <Question
          attributes={[['fooKey', 'fooValue']]}
          id="EX01"
          questionClasses={['text']}
        />
      )
      const questionComponent = wrapper.find(InputQuestion)
      expect(questionComponent.prop('value')).toBe('41')
      questionComponent.prop('onChange')('42')
      expect(mockDispatch).toBeCalledWith(
        questionAnswered({
          answer: '42',
          attributes: { fooKey: 'fooValue' },
          questionId: 'foo/bar#EX01',
        })
      )
    })
  })

  describe('ExerciseContext', () => {
    const addQuestion = jest.fn()
    const addQuestionAnswered = jest.fn()
    const getShowResult = jest.fn()
    const MockProvider = ({ children }) => (
      <ExerciseContext.Provider
        value={{ addQuestion, addQuestionAnswered, getShowResult }}
      >
        {children}
      </ExerciseContext.Provider>
    )

    beforeEach(() => {
      addQuestion.mockClear()
      addQuestionAnswered.mockClear()
      getShowResult.mockClear()
    })

    it('should add question to context', () => {
      mount(
        <MockProvider>
          <Question
            attributes={[['foo', 'bar']]}
            id="EX99"
            questionClasses={['text']}
          />
        </MockProvider>
      )
      expect(addQuestion).toBeCalledTimes(1)
      expect(addQuestion).toBeCalledWith('foo/bar#EX99')
      expect(addQuestionAnswered).not.toBeCalled()
    })

    it('should add answered question to context', () => {
      mockQuestion = { answer: 'foo' }
      mount(
        <MockProvider>
          <Question
            attributes={[['foo', 'bar']]}
            id="EX91"
            questionClasses={['text']}
          />
        </MockProvider>
      )
      expect(addQuestion).toBeCalledTimes(1)
      expect(addQuestion).toBeCalledWith('foo/bar#EX91')
      expect(addQuestionAnswered).toBeCalledTimes(1)
      expect(addQuestionAnswered).toBeCalledWith('foo/bar#EX91')
    })

    describe('getShowResult', () => {
      it.each([
        [true, null, false, undefined],
        [true, true, true, css.correct],
        [true, false, true, css.incorrect],
        [false, null, false, undefined],
        [false, true, false, undefined],
        [false, false, false, undefined],
      ])(
        'getShowResult=%s correct=%s showsResult=%s className=%s',
        (getShowResultValue, correctValue, expShowResult, expClassName) => {
          mockQuestion = { answer: 'foo', correct: correctValue }
          getShowResult.mockReturnValue(getShowResultValue)
          const wrapper = mount(
            <MockProvider>
              <Question
                attributes={[['foo', 'bar']]}
                id="EX91"
                questionClasses={['text']}
              />
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

  describe('should render', () => {
    it('is correct', () => {
      mockQuestion = { answer: '42', correct: true }
      const wrapper = shallow(
        <Question
          attributes={[['foo', 'bar']]}
          id="EX01"
          questionClasses={['text']}
        />
      )
      const inputQuestion = wrapper.find(InputQuestion)
      expect(inputQuestion).toHaveLength(1)
      expect(inputQuestion.prop('attributes')).toEqual({ foo: 'bar' })
      expect(inputQuestion.hasClass(css.correct)).toBe(true)
      expect(inputQuestion.prop('icon')).toEqual(<FeedbackIcon correct />)
      expect(inputQuestion.prop('value')).toBe('42')
    })

    it('is incorrect', () => {
      mockQuestion = { answer: '41', correct: false }
      const wrapper = shallow(
        <Question attributes={[]} id="EX02" questionClasses={['text']} />
      )
      const inputQuestion = wrapper.find(InputQuestion)
      expect(inputQuestion).toHaveLength(1)
      expect(inputQuestion.prop('attributes')).toEqual({})
      expect(inputQuestion.hasClass(css.incorrect)).toBe(true)
      expect(inputQuestion.prop('icon')).toEqual(
        <FeedbackIcon correct={false} />
      )
      expect(inputQuestion.prop('value')).toBe('41')
    })
  })

  describe('mapClassNameToComponent', () => {
    it.each([
      ['text', InputQuestion],
      ['checkbox', CheckboxQuestion],
    ])(
      'should map className (%s) to correct Component',
      (className, Component) => {
        const wrapper = shallow(
          <Question attributes={[]} id="EX01" questionClasses={[className]} />
        )
        expect(wrapper.is(Component)).toBe(true)
      }
    )

    it('should render unknownQuestion for unknown component className (non-production)', () => {
      const wrapper = shallow(
        <Question
          attributes={[]}
          id="EX01"
          questionClasses={['this-component-does-not-exist']}
        />
      )
      expect(wrapper.type()).toBe('span')
      expect(wrapper.hasClass(css.unknownQuestion)).toBe(true)
    })

    it('should render empty for unknown component className (production)', () => {
      process.env.NODE_ENV = 'production'
      const wrapper = shallow(
        <Question
          attributes={[]}
          id="EX01"
          questionClasses={['this-component-does-not-exist']}
        />
      )
      expect(wrapper.isEmptyRender()).toBe(true)
    })
  })
})
