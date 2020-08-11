import React from 'react'
import { shallow } from 'enzyme'

import { addQuestion, questionAnswered } from '@innodoc/client-store/src/actions/question'
import exerciseSelectors from '@innodoc/client-store/src/selectors/exercise'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import ExerciseContext from './ExerciseContext'
import ExerciseProvider from './ExerciseProvider'

const mockDispatch = jest.fn()
const mockExerciseSelectors = exerciseSelectors
const mockSectionSelectors = sectionSelectors
let mockAllAnswered = false
let mockAllCorrect = false

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (sel) => {
    if (sel === mockSectionSelectors.getCurrentSection) {
      return { id: 'foo/bar' }
    }
    if (sel === mockExerciseSelectors.getExerciseAnswered) {
      return mockAllAnswered
    }
    return mockAllCorrect
  },
}))

const createContext = () => {
  const wrapper = shallow(
    <ExerciseProvider id="EX0">
      <div />
    </ExerciseProvider>
  )
  return () => wrapper.find(ExerciseContext.Provider).prop('value')
}

describe('<ExerciseProvider />', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('question tracking', () => {
    it('dispatches addQuestion', () => {
      createContext()().addQuestion('foo/bar#Q0', 4)
      expect(mockDispatch).toBeCalledWith(addQuestion('foo/bar#EX0', 'foo/bar#Q0', 4))
    })

    it('dispatches questionAnswered', () => {
      createContext()().questionAnswered('foo/bar#Q0', 'foo', {
        precision: 4,
      })
      expect(mockDispatch).toBeCalledWith(questionAnswered('foo/bar#Q0', 'foo', { precision: 4 }))
    })

    it.each([true, false])('detects all answered (%s)', (val) => {
      mockAllAnswered = val
      expect(createContext()().answered).toBe(val)
    })

    it.each([true, false])('detects all correct (%s)', (val) => {
      mockAllCorrect = val
      expect(createContext()().correct).toBe(val)
    })
  })

  describe('show results', () => {
    it('should always show results (default)', () => {
      const getContext = createContext()
      expect(getContext().getShowResult()).toBe(true)
    })

    it('should show results only when triggered (autoVerify=false)', () => {
      const getContext = createContext()
      getContext().setAutoVerify(false)
      expect(getContext().getShowResult()).toBe(false)
      getContext().setUserTriggeredVerify(true)
      expect(getContext().getShowResult()).toBe(true)
    })
  })
})
