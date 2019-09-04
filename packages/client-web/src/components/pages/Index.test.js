import React from 'react'
import { shallow } from 'enzyme'

import { actionTypes as uiActionTypes } from '@innodoc/client-store/src/actions/ui'

import Index from './Index'
import Layout from '../Layout'

jest.mock('../Layout', () => (() => null))

describe('<IndexPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<Index />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
  })
})

let mockApp
let mockCourse
jest.mock('@innodoc/client-store/src/selectors', () => ({
  getApp: () => mockApp,
}))
jest.mock('@innodoc/client-store/src/selectors/course', () => ({
  getCurrentCourse: () => mockCourse,
}))

describe.each(['page', 'section'])('getInitialProps (%s)', (contentType) => {
  let ctx
  const pagePathPrefix = 'p'
  const sectionPathPrefix = 's'
  beforeEach(() => {
    mockApp = { pagePathPrefix, sectionPathPrefix }
    mockCourse = { homeLink: `/${contentType}/foo/bar` }
    ctx = {
      store: {
        dispatch: jest.fn(),
        getState: () => {},
        subscribe: (cb) => {
          setTimeout(() => cb(), 0)
          return () => {}
        },
      },
      res: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
    }
  })

  it('should wait for course and redirect permanently to homeLink', async () => {
    expect.assertions(3)
    await Index.getInitialProps(ctx)
    expect(ctx.store.dispatch).not.toHaveBeenCalled()
    const pathPrefix = contentType === 'page' ? pagePathPrefix : sectionPathPrefix
    expect(ctx.res.writeHead).toBeCalledWith(301, { Location: `/${pathPrefix}/foo/bar` })
    expect(ctx.res.end).toHaveBeenCalled()
  })

  it("should do nothing when course couldn't be fetched", async () => {
    mockCourse = null
    mockApp.error = new Error()
    expect.assertions(3)
    await Index.getInitialProps(ctx)
    expect(ctx.store.dispatch).not.toHaveBeenCalled()
    expect(ctx.res.writeHead).not.toHaveBeenCalled()
    expect(ctx.res.end).not.toHaveBeenCalled()
  })

  it("should dispatch showMessage when homeLink couldn't be parsed", async () => {
    mockCourse = { homeLink: '/foo/bar' }
    expect.assertions(3)
    await Index.getInitialProps(ctx)
    expect(ctx.store.dispatch.mock.calls[0][0].type).toBe(uiActionTypes.SHOW_MESSAGE)
    expect(ctx.res.writeHead).not.toHaveBeenCalled()
    expect(ctx.res.end).not.toHaveBeenCalled()
  })
})
