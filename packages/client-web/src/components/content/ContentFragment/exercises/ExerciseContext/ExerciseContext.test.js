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
          isAnswered={c.isAnswered}
          isCorrect={c.isCorrect}
          dispatchAnswer={c.dispatchAnswer}
          showResult={c.showResult}
        />
      )
    }
    const div = shallow(<MyComponent />)
    expect(div.invoke('addQuestion')()).toBeUndefined()
    expect(div.prop('isAnswered')).toBe(false)
    expect(div.prop('isCorrect')).toBe(false)
    expect(div.invoke('dispatchAnswer')()).toBeUndefined()
    expect(div.prop('showResult')).toBe(false)
  })
})
