// TODO
import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import { HYDRATE } from 'next-redux-wrapper'

import withNextRedux, { getRootReducer } from './withNextRedux'

jest.mock('@innodoc/common/src/i18n')

describe('withNextRedux', () => {
  it('should return HOC', async () => {
    const Comp = () => {}
    const WrappedComp = withNextRedux(Comp)
    const wrapper = shallow(<WrappedComp />)
    expect(wrapper.find(Provider).exists()).toBe(true)
  })
})

describe('getRootReducer', () => {
  let rootReducer
  const otherReducer = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    rootReducer = getRootReducer(otherReducer)
  })

  it('should handle HYDRATE', () => {
    const oldState = { foo: 'Foo' }
    const newState = rootReducer(oldState, {
      type: HYDRATE,
      payload: { bar: 'Bar' },
    })
    expect(newState).toEqual({
      bar: 'Bar',
      foo: 'Foo',
    })
    expect(otherReducer).not.toBeCalled()
  })

  it('should delegate to innerReducer otherwise', () => {
    const oldState = { foo: 'Foo' }
    const action = { type: 'SOME_ACTION' }
    rootReducer(oldState, action)
    expect(otherReducer).toBeCalledWith(oldState, action)
  })
})
