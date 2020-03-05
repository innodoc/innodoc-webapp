import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import Head from 'next/head'
import Router from 'next/router'

import {
  loadManifest,
  setServerConfiguration,
} from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'

import { InnoDocApp, waitForCourse } from './App'

jest.mock('next/router', () => ({
  events: { on: jest.fn() },
}))

let mockGetCurrentCourse
jest.mock('@innodoc/client-store/src/selectors/course', () => ({
  getCurrentCourse: () => mockGetCurrentCourse(),
}))

let mockGetApp
jest.mock('@innodoc/client-store/src/selectors', () => {
  const actualSelectors = jest.requireActual(
    '@innodoc/client-store/src/selectors'
  )
  return {
    ...actualSelectors,
    getApp: () => mockGetApp(),
  }
})

describe('<InnoDocApp />', () => {
  beforeEach(() => {
    mockGetApp = () => ({})
  })

  describe('render', () => {
    const DummyComponent = () => {}
    const mockStore = {
      dispatch: () => {},
      getState: () => {},
      subscribe: () => {},
    }

    it('should render', () => {
      const wrapper = shallow(
        <InnoDocApp
          Component={DummyComponent}
          pageProps={{}}
          store={mockStore}
          router={{}}
        />
      )
      expect(wrapper.find(Head).exists()).toBe(true)
      expect(wrapper.find(Provider).exists()).toBe(true)
      expect(wrapper.find(DummyComponent).exists()).toBe(true)
    })

    it('should subscribe to Router.routeChangeStart', () => {
      const dispatchNavigate = () => {}
      Router.events.on.mockClear()
      shallow(
        <InnoDocApp
          Component={DummyComponent}
          dispatchNavigate={dispatchNavigate}
          pageProps={{}}
          store={mockStore}
        />
      )
      expect(Router.events.on).toBeCalledTimes(1)
      expect(Router.events.on.mock.calls[0][0]).toBe('routeChangeStart')
      expect(Router.events.on.mock.calls[0][1]).toBe(dispatchNavigate)
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

    it('should dispatch actions (server)', async () => {
      expect.assertions(4)
      const ctx = {
        store: mockStore,
        res: {
          locals: {
            appRoot: 'https://app.example.com/',
            contentRoot: 'https://content.example.com/',
            staticRoot: 'https://cdn.example.com/',
            sectionPathPrefix: 'section',
            pagePathPrefix: 'page',
          },
        },
        req: { i18n: { language: 'en-US' } },
      }
      await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
      expect(mockStore.dispatch).toBeCalledTimes(3)
      expect(mockStore.dispatch).toBeCalledWith(
        setServerConfiguration(
          'https://app.example.com/',
          'https://content.example.com/',
          'https://cdn.example.com/',
          'section',
          'page'
        )
      )
      expect(mockStore.dispatch).toBeCalledWith(languageDetected('en-US'))
      expect(mockStore.dispatch).toBeCalledWith(loadManifest())
    })

    it('should not dispatch anything (client)', async () => {
      expect.assertions(1)
      const ctx = { store: mockStore }
      await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
      expect(mockStore.dispatch).not.toHaveBeenCalled()
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

      it.each(['default', 'custom'])(
        'should inject %s mathJaxOptions',
        async (optionType) => {
          expect.assertions(1)
          if (optionType !== 'default') {
            mockGetCurrentCourse = () => ({
              mathJaxOptions: { chtml: { fontURL: 'foo' } },
            })
          }
          const ctx = { store: mockStore }
          const Component = () => {}
          const {
            pageProps: { mathJaxOptions },
          } = await InnoDocApp.getInitialProps({
            ctx,
            Component,
          })
          if (optionType === 'default') {
            expect(mathJaxOptions.chtml.fontURL).toMatch(
              '/fonts/mathjax-woff-v2'
            )
          } else {
            expect(mathJaxOptions.chtml.fontURL).toBe('foo')
          }
        }
      )

      it('should retrieve pageProps from Component', async () => {
        expect.assertions(3)
        const ctx = { store: mockStore }
        const Component = () => {}
        Component.getInitialProps = jest.fn(() => ({ foo: 'bar' }))
        const { pageProps } = await InnoDocApp.getInitialProps({
          ctx,
          Component,
        })
        expect(Component.getInitialProps).toBeCalledTimes(1)
        expect(Component.getInitialProps).toBeCalledWith(ctx)
        expect(pageProps.foo).toEqual('bar')
      })
    })
  })
})

describe('waitForCourse', () => {
  let storeCallback
  const mockStore = {
    getState: () => {},
    subscribe: jest.fn((cb) => {
      storeCallback = cb
      return () => {}
    }),
    fakeUpdate: () => {
      storeCallback()
    },
  }
  const course = { mockCourse: 'foo' }
  const getCurrentCourse = () => course

  beforeEach(() => {
    storeCallback = undefined
    mockStore.subscribe.mockClear()
    mockGetCurrentCourse = getCurrentCourse
    mockGetApp = () => ({})
  })

  it("should return course if it's immediately available", async () => {
    expect.assertions(2)
    const returnedCourse = await waitForCourse(mockStore)
    expect(returnedCourse).toBe(course)
    expect(mockStore.subscribe).not.toHaveBeenCalled()
  })

  it('should return when course becomes available', async () => {
    expect.assertions(2)
    mockGetCurrentCourse = () => {}
    const waitForCoursePromise = waitForCourse(mockStore)
    mockStore.fakeUpdate()
    mockStore.fakeUpdate()
    mockGetCurrentCourse = getCurrentCourse
    mockStore.fakeUpdate()
    const returnedCourse = await waitForCoursePromise
    expect(returnedCourse).toBe(course)
    expect(mockStore.subscribe).toBeCalledTimes(1)
  })

  it('should reject with error', async () => {
    expect.assertions(2)
    const error = new Error('foo')
    mockGetApp = () => ({ error })
    mockGetCurrentCourse = () => {}
    const waitForCoursePromise = waitForCourse(mockStore)
    mockStore.fakeUpdate()
    await expect(waitForCoursePromise).rejects.toBe(error)
    expect(mockStore.subscribe).toBeCalledTimes(1)
  })
})
