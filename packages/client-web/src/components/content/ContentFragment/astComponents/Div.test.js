import React from 'react'
import { shallow } from 'enzyme'

import Div from './Div'
import UnknownType from './UnknownType'
import ExerciseCard from '../exercises/ExerciseCard'
import Figure from './Figure'

describe('<Div />', () => {
  it.each([
    ['figure', Figure],
    ['exercise', ExerciseCard],
  ])('should map className "%s" to correct Component', (className, Component) => {
    const content = [{ foo: 'foo' }, { bar: 'bar' }]
    const wrapper = shallow(<Div data={[[null, [className], []], content]} />)
    expect(wrapper.is(Component)).toBe(true)
    expect(wrapper.prop('content')).toBe(content)
  })

  it('should render UnknownType for an unknown className (non-production)', () => {
    const wrapper = shallow(<Div data={[[null, ['this-does-really-not-exist-ab93ldc']], []]} />)
    expect(wrapper.is(UnknownType)).toBe(true)
  })

  it('should render UnknownType for an unknown className (production)', () => {
    process.env.NODE_ENV = 'production'
    const wrapper = shallow(<Div data={[[null, ['this-does-really-not-exist-ab93ldc']], []]} />)
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})
