import React, { useContext } from 'react'
import { shallow } from 'enzyme'

import ExerciseContext from './ExerciseContext'

describe('<ExerciseContext />', () => {
  it('should provide defaults', () => {
    const MyComponent = () => {
      const exerciseContext = useContext(ExerciseContext)
      return <div {...exerciseContext} />
    }
    const div = shallow(<MyComponent />).find('div')
    expect(div.prop('addQuestion')).toBeInstanceOf(Function)
    expect(div.prop('addQuestionAnswered')).toBeInstanceOf(Function)
    expect(div.prop('allAnswered')).toBeInstanceOf(Function)
    expect(div.prop('getShowResult')).toBeInstanceOf(Function)
    expect(div.prop('setAutoVerify')).toBeInstanceOf(Function)
    expect(div.prop('setUserTriggeredVerify')).toBeInstanceOf(Function)
    expect(typeof div.prop('userTriggeredVerify')).toBe('boolean')
  })
})
