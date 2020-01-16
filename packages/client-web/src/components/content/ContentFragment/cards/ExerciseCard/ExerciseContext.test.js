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
    const div = shallow(<MyComponent />)
    expect(div.invoke('addQuestion')()).toBeUndefined()
    expect(div.invoke('addQuestionAnswered')()).toBeUndefined()
    expect(div.invoke('allAnswered')()).toBe(true)
    expect(div.invoke('getShowResult')()).toBe(true)
    expect(div.invoke('setAutoVerify')()).toBeUndefined()
    expect(div.invoke('setUserTriggeredVerify')()).toBeUndefined()
    expect(div.prop('userTriggeredVerify')).toBe(false)
  })
})
