import React from 'react'
import { shallow } from 'enzyme'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import { questionAnswered } from '@innodoc/client-store/src/actions/question'

import FeedbackIcon from './FeedbackIcon'
import Question from './Question'
import InputQuestion from './InputQuestion'
import CheckboxQuestion from './CheckboxQuestion'

// TODO: once enzyme support hooks, this should be extended to
// consider useContext(ExerciseContext)

const mockGetCurrentSection = sectionSelectors.getCurrentSection
const mockSection = { id: 'foo/bar' }
let mockQuestion = {}
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: (selector) => (
    selector === mockGetCurrentSection
      ? mockSection
      : mockQuestion
  ),
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
        <Question attributes={[['fooKey', 'fooValue']]} id="EX01" questionClasses={['text']} />
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

  describe('should render', () => {
    it('correct', () => {
      mockQuestion = { answer: '42', correct: true }
      const wrapper = shallow(
        <Question attributes={[['foo', 'bar']]} id="EX01" questionClasses={['text']} />
      )
      const inputQuestion = wrapper.find(InputQuestion)
      expect(inputQuestion).toHaveLength(1)
      expect(inputQuestion.prop('attributes')).toEqual({ foo: 'bar' })
      expect(inputQuestion.hasClass('correct')).toBe(true)
      expect(inputQuestion.prop('icon')).toEqual(<FeedbackIcon correct />)
      expect(inputQuestion.prop('value')).toBe('42')
    })

    it('incorrect', () => {
      mockQuestion = { answer: '41', correct: false }
      const wrapper = shallow(
        <Question attributes={[]} id="EX02" questionClasses={['text']} />
      )
      const inputQuestion = wrapper.find(InputQuestion)
      expect(inputQuestion).toHaveLength(1)
      expect(inputQuestion.prop('attributes')).toEqual({})
      expect(inputQuestion.hasClass('incorrect')).toBe(true)
      expect(inputQuestion.prop('icon')).toEqual(<FeedbackIcon correct={false} />)
      expect(inputQuestion.prop('value')).toBe('41')
    })
  })

  describe('mapClassNameToComponent', () => {
    it.each([
      ['text', InputQuestion],
      ['checkbox', CheckboxQuestion],
    ])('should map className (%s) to correct Component', (className, Component) => {
      const wrapper = shallow(
        <Question attributes={[]} id="EX01" questionClasses={[className]} />
      )
      expect(wrapper.is(Component)).toBe(true)
    })

    it('should render unknownQuestion for unknown component className', () => {
      const wrapper = shallow(
        <Question attributes={[]} id="EX01" questionClasses={['this-component-does-not-exist']} />
      )
      expect(wrapper.hasClass('unknownQuestion')).toBe(true)
    })
  })
})
