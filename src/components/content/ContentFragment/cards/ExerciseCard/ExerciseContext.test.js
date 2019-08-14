import React, { useContext } from 'react'
import { shallow } from 'enzyme'

import ExerciseContext from './ExerciseContext'

describe('<ExerciseContext />', () => {
  it('should provide defaults', () => {
    const MyComponent = () => {
      const c = useContext(ExerciseContext)
      return (
        <div
          addQuestion={c.addQuestion}
          addQuestionAnswered={c.addQuestionAnswered}
          allAnswered={c.allAnswered}
          getShowResult={c.getShowResult}
          setAutoVerify={c.setAutoVerify}
          setUserTriggeredVerify={c.setUserTriggeredVerify}
          userTriggeredVerify={c.userTriggeredVerify}
        />
      )
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
