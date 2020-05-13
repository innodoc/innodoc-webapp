import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import Router from 'next/router'

import {
  loadManifest,
  routeChangeStart,
  setServerConfiguration,
} from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import {
  actionTypes as userActionTypes,
  userLoggedIn,
} from '@innodoc/client-store/src/actions/user'

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
      const wrapper = shallow(
        <InnoDocApp
          Component={DummyComponent}
          pageProps={{}}
          store={mockStore}
          router={{}}
        />
      )
      expect(wrapper.find(PageTitle).exists()).toBe(true)
      expect(wrapper.find(Provider).exists()).toBe(true)
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

    describe('dispatch actions (server)', () => {
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
        req: {
          csrfToken: () => '123csrfToken!',
          i18n: { language: 'en-US' },
        },
      }

      it('should dispatch setServerConfiguration', async () => {
        expect.assertions(1)
        await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
        expect(mockStore.dispatch).toBeCalledWith(
          setServerConfiguration(
            'https://app.example.com/',
            'https://content.example.com/',
            'https://cdn.example.com/',
            '123csrfToken!',
            'section',
            'page'
          )
        )
      })

      it('should dispatch languageDetected', async () => {
        expect.assertions(1)
        await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
        expect(mockStore.dispatch).toBeCalledWith(languageDetected('en-US'))
      })

      it('should dispatch loadManifest', async () => {
        expect.assertions(1)
        await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
        expect(mockStore.dispatch).toBeCalledWith(loadManifest())
      })

      it('should dispatch userLoggedIn with loggedInEmail', async () => {
        expect.assertions(1)
        const newCtx = {
          ...ctx,
          res: {
            locals: { ...ctx.res.locals, loggedInEmail: 'alice@example.com' },
          },
        }
        await InnoDocApp.getInitialProps({ ctx: newCtx, Component: () => {} })
        expect(mockStore.dispatch).toBeCalledWith(
          userLoggedIn('alice@example.com')
        )
      })

      it('should not dispatch userLoggedIn w/o loggedInEmail', async () => {
        expect.assertions(1)
        await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
        const actions = mockStore.dispatch.mock.calls.map(
          (call) => call[0].type
        )
        expect(actions).not.toContain(userActionTypes.USER_LOGGED_IN)
      })
    })

    it('should subscribe to Router.routeChangeStart (client)', async () => {
      expect.assertions(5)
      const ctx = { store: mockStore }
      await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
      expect(Router.events.on).toBeCalledTimes(1)
      const [eventName, eventFunc] = Router.events.on.mock.calls[0]
      expect(eventName).toBe('routeChangeStart')
      expect(eventFunc).toEqual(expect.any(Function))
      eventFunc()
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1)
      expect(mockStore.dispatch).toHaveBeenCalledWith(routeChangeStart())
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
