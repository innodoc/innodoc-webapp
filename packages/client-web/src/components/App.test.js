import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import Head from 'next/head'

import { loadManifest, setServerConfiguration } from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'

import { InnoDocApp } from './App'

describe('<InnoDocApp />', () => {
  it('should render', () => {
    const mockStore = { dispatch: () => {}, getState: () => {}, subscribe: () => {} }
    const DummyComponent = () => {}
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

  describe('getInitialProps', () => {
    it('should dispatch actions (server)', async () => {
      expect.assertions(4)
      const dispatch = jest.fn()
      const ctx = {
        isServer: true,
        store: { dispatch },
        res: {
          locals: {
            contentRoot: 'https://content.example.com/',
            staticRoot: 'https://cdn.example.com/',
            sectionPathPrefix: 'section',
            pagePathPrefix: 'page',
          },
        },
        req: { i18n: { language: 'en-US' } },
      }
      await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
      expect(dispatch).toBeCalledTimes(3)
      expect(dispatch).toBeCalledWith(
        setServerConfiguration(
          'https://content.example.com/',
          'https://cdn.example.com/',
          'section',
          'page',
        )
      )
      expect(dispatch).toBeCalledWith(languageDetected('en-US'))
      expect(dispatch).toBeCalledWith(loadManifest())
    })

    it('should not dispatch anything (client)', async () => {
      expect.assertions(1)
      const dispatch = jest.fn()
      const ctx = {
        isServer: false,
        store: { dispatch },
      }
      await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
      expect(dispatch).not.toHaveBeenCalled()
    })

    it('should inject namespacesRequired into pageProps', async () => {
      expect.assertions(1)
      const ctx = {
        isServer: false,
        store: { dispatch: () => {} },
      }
      const Component = () => {}
      const { pageProps } = await InnoDocApp.getInitialProps({ ctx, Component })
      expect(pageProps.namespacesRequired).toEqual(['common'])
    })

    it('should retrieve pageProps', async () => {
      expect.assertions(3)
      const ctx = {
        isServer: false,
        store: { dispatch: () => {} },
      }
      const Component = () => {}
      Component.getInitialProps = jest.fn(() => ({ foo: 'bar' }))
      const { pageProps } = await InnoDocApp.getInitialProps({ ctx, Component })
      expect(Component.getInitialProps).toBeCalledTimes(1)
      expect(Component.getInitialProps).toBeCalledWith(ctx)
      expect(pageProps.foo).toEqual('bar')
    })
  })
})