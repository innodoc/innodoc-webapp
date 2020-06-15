import React from 'react'
import { mount } from 'enzyme'
import Router from 'next/router'

import { routeChangeStart } from '@innodoc/client-store/src/actions/content'

import useRouteNotifier from './useRouteNotifier'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))

jest.mock('next/router', () => ({
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
}))

const Component = () => {
  useRouteNotifier()
  return <div />
}

describe('useRouteNotifier', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should dispatch routeChangeStart on route change', () => {
    mount(<Component />)
    const eventHandler = Router.events.on.mock.calls[0][1]
    expect(mockDispatch).not.toBeCalled()
    eventHandler()
    expect(mockDispatch).toBeCalledWith(routeChangeStart())
  })

  it('should subscribe to routeChangeStart events', async () => {
    expect.assertions(1)
    const wrapper = mount(<Component />)
    await waitForComponent(wrapper)
    expect(Router.events.on).toBeCalledWith(
      'routeChangeStart',
      expect.any(Function)
    )
  })

  it('should unsubscribe on unmount', async () => {
    expect.assertions(2)
    const wrapper = mount(<Component />)
    expect(Router.events.off).not.toBeCalled()
    wrapper.unmount()
    await waitForComponent(wrapper)
    expect(Router.events.off).toBeCalledWith(
      'routeChangeStart',
      expect.any(Function)
    )
  })
})
