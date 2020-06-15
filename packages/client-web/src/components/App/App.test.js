import React from 'react'
import { shallow } from 'enzyme'

import MathJax from '@innodoc/react-mathjax-node'

import { InnoDocApp } from './App'
import PageTitle from '../PageTitle'

jest.mock('next/router', () => ({
  events: { on: jest.fn() },
}))

let mockGetCurrentCourse
jest.mock('@innodoc/client-store/src/selectors/course', () => ({
  getCurrentCourse: () => mockGetCurrentCourse(),
}))

describe('<InnoDocApp />', () => {
  describe('render', () => {
    const DummyComponent = () => {}
    const mockStore = {
      dispatch: () => {},
      getState: () => {},
      subscribe: () => {},
    }

    it('should render', () => {
      const mathJaxOptions = { foo: 'bar' }
      const wrapper = shallow(
        <InnoDocApp
          Component={DummyComponent}
          mathJaxOptions={mathJaxOptions}
          pageProps={{}}
          store={mockStore}
          router={{}}
        />
      )
      expect(wrapper.find(PageTitle).exists()).toBe(true)
      expect(wrapper.find(MathJax.ConfigProvider).prop('options')).toBe(
        mathJaxOptions
      )
      expect(wrapper.find(DummyComponent).exists()).toBe(true)
    })
  })

  describe('getInitialProps', () => {
    const mockStore = {
      dispatch: jest.fn(),
      getState: () => {},
      subscribe: jest.fn((cb) => {
        cb()
        return () => {}
      }),
    }

    beforeEach(() => {
      mockStore.dispatch.mockClear()
      mockStore.subscribe.mockClear()
      mockGetCurrentCourse = () => ({
        mathJaxOptions: {},
      })
    })

    describe('pageProps', () => {
      it('should inject namespacesRequired', async () => {
        expect.assertions(1)
        const ctx = { store: mockStore }
        const Component = () => {}
        const { pageProps } = await InnoDocApp.getInitialProps({
          ctx,
          Component,
        })
        expect(pageProps.namespacesRequired).toEqual(['common'])
      })

      it('should retrieve pageProps from PageComponent', async () => {
        expect.assertions(3)
        const ctx = { store: mockStore }
        const Page = () => {}
        Page.getInitialProps = jest.fn(() => ({ foo: 'bar' }))
        const { pageProps } = await InnoDocApp.getInitialProps({
          ctx,
          Component: Page,
        })
        expect(Page.getInitialProps).toBeCalledTimes(1)
        expect(Page.getInitialProps).toBeCalledWith(ctx)
        expect(pageProps.foo).toEqual('bar')
      })
    })
  })
})
