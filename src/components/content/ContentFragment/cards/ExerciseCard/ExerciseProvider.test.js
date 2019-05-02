import React from 'react'
import { shallow } from 'enzyme'

import ExerciseContext from './ExerciseContext'
import ExerciseProvider from './ExerciseProvider'

const createContext = () => {
  const wrapper = shallow(
    <ExerciseProvider>
      <div />
    </ExerciseProvider>
  )
  return () => wrapper.find(ExerciseContext.Provider).prop('value')
}

describe('<ExerciseProvider />', () => {
  describe('question tracking', () => {
    it('detects all answered', () => {
      const getContext = createContext()
      getContext().addQuestion('foo/bar#EX0')
      getContext().addQuestionAnswered('foo/bar#EX0')
      getContext().addQuestion('foo/bar#EX1')
      getContext().addQuestionAnswered('foo/bar#EX1')
      expect(getContext().allAnswered()).toBe(true)
    })

    it('detects not all answered', () => {
      const getContext = createContext()
      getContext().addQuestion('foo/bar#EX0')
      getContext().addQuestionAnswered('foo/bar#EX0')
      getContext().addQuestion('foo/bar#EX1')
      expect(getContext().allAnswered()).toBe(false)
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
