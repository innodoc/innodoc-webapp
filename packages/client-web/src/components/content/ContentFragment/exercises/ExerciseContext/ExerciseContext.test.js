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
          answered={c.answered}
          correct={c.correct}
          getShowResult={c.getShowResult}
          questionAnswered={c.questionAnswered}
          setAutoVerify={c.setAutoVerify}
          setUserTriggeredVerify={c.setUserTriggeredVerify}
          userTriggeredVerify={c.userTriggeredVerify}
        />
      )
    }
    const div = shallow(<MyComponent />)
    expect(div.invoke('addQuestion')()).toBeUndefined()
    expect(div.prop('answered')).toBe(false)
    expect(div.prop('correct')).toBe(false)
    expect(div.invoke('getShowResult')()).toBe(true)
    expect(div.invoke('questionAnswered')()).toBeUndefined()
    expect(div.invoke('setAutoVerify')()).toBeUndefined()
    expect(div.invoke('setUserTriggeredVerify')()).toBeUndefined()
    expect(div.prop('userTriggeredVerify')).toBe(false)
  })
})
