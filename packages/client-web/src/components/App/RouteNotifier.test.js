import React from 'react'
import { mount } from 'enzyme'
import Router from 'next/router'

import { routeChangeStart } from '@innodoc/client-store/src/actions/content'
import RouteNotifier from './RouteNotifier'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('next/router', () => ({
  events: { on: jest.fn(), off: jest.fn() },
}))

describe('<RouteNotifier />', () => {
  beforeEach(jest.clearAllMocks)

  it('should subscribe to routeChangeStart', async () => {
    expect.assertions(4)
    const wrapper = mount(<RouteNotifier />)
    expect(wrapper.isEmptyRender()).toBe(true)
    await waitForComponent(wrapper)
    expect(Router.events.on).toHaveBeenCalledTimes(1)
    const [eventName, handler] = Router.events.on.mock.calls[0]
    expect(eventName).toBe('routeChangeStart')
    expect(handler).toEqual(expect.any(Function))
  })

  it('should unsubscribe on unmount', async () => {
    expect.assertions(3)
    const wrapper = mount(<RouteNotifier />)
    await waitForComponent(wrapper)
    const [, onHandler] = Router.events.on.mock.calls[0]
    wrapper.unmount()
    expect(Router.events.off).toHaveBeenCalledTimes(1)
    const [eventName, offHandler] = Router.events.off.mock.calls[0]
    expect(offHandler).toBe(onHandler)
    expect(eventName).toBe('routeChangeStart')
  })

  it('should dispatch routeChangeStart() on event', async () => {
    expect.assertions(2)
    const wrapper = mount(<RouteNotifier />)
    await waitForComponent(wrapper)
    Router.events.on.mock.calls[0][1]()
    expect(mockDispatch).toBeCalledTimes(1)
    expect(mockDispatch).toBeCalledWith(routeChangeStart())
  })
})
