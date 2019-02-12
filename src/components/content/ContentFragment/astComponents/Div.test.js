import React from 'react'
import { shallow } from 'enzyme'

import Div, { classNameComponentMap } from './Div'
import UnknownType from './UnknownType'

describe('<Div />', () => {
  const args = Object.keys(classNameComponentMap)
    .map(clsName => [clsName, classNameComponentMap[clsName]])
  it.each(args)(
    'should map className "%s" to correct Component', (className, Component) => {
      const wrapper = shallow(<Div data={[[null, [className]], []]} />)
      expect(wrapper.is(Component)).toBe(true)
    })

  it('should render UnknownType for an unknown className', () => {
    const wrapper = shallow(<Div data={[[null, ['this-does-really-not-exist-ab93ldc']], []]} />)
    expect(wrapper.is(UnknownType)).toBe(true)
  })
})
