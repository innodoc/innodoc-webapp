import React from 'react'
import { shallow } from 'enzyme'

import { addQuestion, questionAnswered } from '@innodoc/client-store/src/actions/question'

import ExerciseProvider from './ExerciseProvider'

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))

const createContext = (setShowResult = () => {}) => {
  const wrapper = shallow(
    <ExerciseProvider
      exercise={{ isAnswered: true, isCorrect: false, id: 'foo/bar#EX0' }}
      setShowResult={setShowResult}
      showResult
    >
      <div />
    </ExerciseProvider>
  )
  return [wrapper, wrapper.prop('value')]
}

describe('<ExerciseProvider />', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should render', () => {
    const [wrapper, context] = createContext()
    expect(wrapper.exists('div')).toBe(true)
    expect(context.addQuestion).toEqual(expect.any(Function))
    expect(context.isAnswered).toBe(true)
    expect(context.isCorrect).toBe(false)
    expect(context.dispatchAnswer).toEqual(expect.any(Function))
    expect(context.showResult).toBe(true)
  })

  describe('question tracking', () => {
    it('should dispatch addQuestion', () => {
      const [, context] = createContext()
      context.addQuestion('foo/bar#Q01', 5)
      expect(mockDispatch).toBeCalledWith(addQuestion('foo/bar#EX0', 'foo/bar#Q01', 5))
    })

    it('should dispatch questionAnswered and call setShowResult(false)', () => {
      const mockSetShowResult = jest.fn()
      const [, context] = createContext(mockSetShowResult)
      context.dispatchAnswer('foo/bar#Q01', '42', { foo: 'bar' })
      expect(mockDispatch).toBeCalledWith(questionAnswered('foo/bar#Q01', '42', { foo: 'bar' }))
      expect(mockSetShowResult).toBeCalledWith(false)
    })
  })
})
