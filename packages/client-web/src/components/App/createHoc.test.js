import React from 'react'
import { mount } from 'enzyme'

import createHoc from './createHoc'

describe('createHoc', () => {
  const WrappedComponent = () => null
  WrappedComponent.getInitialProps = () => ({ anotherProp: 'bar' })
  const doSomethingFancy = jest.fn()
  const withFancyHoc = createHoc('WithFancyHoc', () => {
    doSomethingFancy()
    return { fancyProp: 'foo' }
  })
  const WithFancyHoc = withFancyHoc(WrappedComponent)
  let wrapper
  let initialProps

  beforeEach(async () => {
    jest.clearAllMocks()
    wrapper = mount(<WithFancyHoc />)
    initialProps = await WithFancyHoc.getInitialProps({ ctx: {} })
  })

  it('should wrap WrappedComponent', () => {
    expect(wrapper.exists(WrappedComponent)).toBe(true)
  })

  it('should add initial props from WrappedComponent', () => {
    expect(initialProps.anotherProp).toBe('bar')
  })

  it('should add own initial props', () => {
    expect(initialProps.fancyProp).toBe('foo')
  })

  it('should set display name', () => {
    expect(wrapper.name()).toBe('WithFancyHoc(WrappedComponent)')
  })
})
