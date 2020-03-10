import React from 'react'
import { shallow } from 'enzyme'

import Index from './Index'

jest.mock('../Layout', () => () => null)

describe('<IndexPage />', () => {
  it('should render empty', () => {
    const wrapper = shallow(<Index />)
    expect(wrapper.isEmptyRender()).toBe(true)
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
      },
      res: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
    }
  })

  it('should wait for course and redirect permanently to homeLink', async () => {
    expect.assertions(4)
    const props = await Index.getInitialProps(ctx)
    expect(props).toEqual({})
    expect(ctx.store.dispatch).not.toHaveBeenCalled()
    const pathPrefix =
      contentType === 'page' ? pagePathPrefix : sectionPathPrefix
    expect(ctx.res.writeHead).toBeCalledWith(301, {
      Location: `/${pathPrefix}/foo/bar`,
    })
    expect(ctx.res.end).toHaveBeenCalled()
  })

  it.each([
    ["course couldn't be fetched", undefined, 'Could not retrieve course!'],
    [
      "homeLink couldn't be parsed",
      { homeLink: 'borken' },
      'Could not parse homeLink: borken',
    ],
  ])('should throw if %s', async (_, course, errMsg) => {
    mockCourse = course
    await expect(Index.getInitialProps(ctx)).rejects.toEqual(new Error(errMsg))
    expect(ctx.res.writeHead).not.toHaveBeenCalled()
    expect(ctx.res.end).not.toHaveBeenCalled()
  })
})
