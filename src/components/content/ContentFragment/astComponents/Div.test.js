import React from 'react'
import { shallow } from 'enzyme'

import ExerciseCard from '../cards/ExerciseCard'
import Figure from './Figure'
import Div from './Div'
import UnknownType from './UnknownType'

describe('<Div />', () => {
  it.each([['figure', Figure], ['exercise', ExerciseCard], ['does-not-exist']])(
    'should map className "%s" to correct Component', (className, Component) => {
      const wrapper = shallow(<Div data={[[null, [className]], []]} />)
      expect(wrapper.is(Component)).toBe(true)
    })

  it('should render UnknownType for an unknown className', () => {
    const wrapper = shallow(<Div data={[[null, ['this-does-really-not-exist-ab93ldc']], []]} />)
    expect(wrapper.is(UnknownType)).toBe(true)
  })
})
