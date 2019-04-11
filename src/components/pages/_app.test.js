import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import Head from 'next/head'
import { Container } from 'next/app'

import { InnoDocApp } from './_app'
import { loadManifest, setContentRoot, setStaticRoot } from '../../store/actions/content'

describe('<InnoDocApp />', () => {
  it('should render', () => {
    const mockStore = { dispatch: () => {}, getState: () => {}, subscribe: () => {} }
    const wrapper = shallow(
      <InnoDocApp
        Component={() => {}}
        pageProps={{}}
        store={mockStore}
        router={{}}
      />
    )
    expect(wrapper.find(Container).exists()).toBe(true)
    expect(wrapper.find(Head).exists()).toBe(true)
    expect(wrapper.find(Provider).exists()).toBe(true)
  })

  describe('getInitialProps', () => {
    it('should dispatch constants and loadManifest (server)', async () => {
      const dispatch = jest.fn()
      const ctx = {
        isServer: true,
        store: { dispatch },
        res: {
          locals: {
            contentRoot: 'https://content.example.com/',
            staticRoot: 'https://cdn.example.com/',
          },
        },
      }
      await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
      expect(dispatch.mock.calls).toEqual([
        [setContentRoot('https://content.example.com/')],
        [setStaticRoot('https://cdn.example.com/')],
        [loadManifest()],
      ])
    })

    it('should not dispatch anything (client)', async () => {
      const dispatch = jest.fn()
      const ctx = {
        isServer: false,
        store: { dispatch },
      }
      await InnoDocApp.getInitialProps({ ctx, Component: () => {} })
      expect(dispatch.mock.calls).toEqual([])
    })

    it('should retrieve props from page component', async () => {
      const ctx = {
        isServer: false,
        store: { dispatch: () => {} },
      }
      const Component = () => {}
      Component.getInitialProps = jest.fn(() => ({ foo: 'bar' }))
      const props = await InnoDocApp.getInitialProps({ ctx, Component })
      expect(Component.getInitialProps.mock.calls).toEqual([[ctx]])
      expect(props).toEqual({ pageProps: { foo: 'bar' } })
    })
  })
})
