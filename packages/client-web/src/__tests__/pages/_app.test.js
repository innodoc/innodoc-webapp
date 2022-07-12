import React from 'react'
import { shallow } from 'enzyme'
import Head from 'next/head'
import { END } from 'redux-saga'

import MathJax from '@innodoc/react-mathjax-node'

import useRouteNotifier from '../../hooks/useRouteNotifier'
import PageTitle from '../PageTitle'
import { InnoDocApp } from './App'

jest.mock('@innodoc/common/src/i18n')

jest.mock('../../hooks/useRouteNotifier', () => jest.fn())

jest.mock('next/router', () => ({
  events: { on: jest.fn() },
}))

jest.mock('./withServerVars', () => (C) => C)
jest.mock('./withLoadManifest', () => (C) => C)

let mockGetCurrentCourse
jest.mock('@innodoc/client-store/src/selectors/course', () => ({
  getCurrentCourse: () => mockGetCurrentCourse(),
}))

describe('<InnoDocApp />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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
      const head = wrapper.find(Head)
      expect(head.exists()).toBe(true)
      const viewportMeta = head.find('meta')
      expect(viewportMeta.exists()).toBe(true)
      expect(viewportMeta.prop('content')).toBe('initial-scale=1.0, width=device-width')
      expect(viewportMeta.prop('name')).toBe('viewport')
      expect(wrapper.find(PageTitle).exists()).toBe(true)
      expect(wrapper.find(MathJax.ConfigProvider).prop('options')).toBe(mathJaxOptions)
      expect(wrapper.find(DummyComponent).exists()).toBe(true)
    })

    it('should useRouteNotifier', () => {
      shallow(
        <InnoDocApp
          Component={DummyComponent}
          mathJaxOptions={{}}
          pageProps={{}}
          store={mockStore}
          router={{}}
        />
      )
      expect(useRouteNotifier).toBeCalled()
    })
  })

  describe('getInitialProps', () => {
    const mockStore = {
      dispatch: jest.fn(),
      getState: () => {},
      sagaTask: { toPromise: jest.fn().mockResolvedValue() },
      subscribe: jest.fn((cb) => {
        cb()
        return () => {}
      }),
    }

    beforeEach(() => {
      jest.clearAllMocks()
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

      describe('end sagas', () => {
        it('should dispatch END and wait for sagas on server', async () => {
          expect.assertions(2)
          const ctx = { store: mockStore, req: {} }
          const Page = () => {}
          await InnoDocApp.getInitialProps({ ctx, Component: Page })
          expect(mockStore.dispatch).toBeCalledWith(END)
          await expect(mockStore.sagaTask.toPromise).toBeCalled()
        })

        it('should not dispatch END and wait for sagas on client', async () => {
          expect.assertions(2)
          const ctx = { store: mockStore }
          const Page = () => {}
          await InnoDocApp.getInitialProps({ ctx, Component: Page })
          expect(mockStore.dispatch).not.toBeCalledWith(END)
          await expect(mockStore.sagaTask.toPromise).not.toBeCalled()
        })
      })
    })
  })
})
