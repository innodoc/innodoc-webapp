import React from 'react'
import { mount } from 'enzyme'

import useIsMounted from './useIsMounted'

const Component = () => {
  const isMounted = useIsMounted()
  return <div ismounted={isMounted.current.toString()} />
}

describe('useIsMounted', () => {
  it('should give isMounted=true only after first render', () => {
    const wrapper = mount(<Component />)
    expect(wrapper.find('div').prop('ismounted')).toBe('false')
    wrapper.setProps({}) // force re-render
    expect(wrapper.find('div').prop('ismounted')).toBe('true')
  })
})
