import withIndexRedirect from './withIndexRedirect'

jest.mock('@innodoc/client-store/src/selectors/course', () => ({
  getCurrentCourse: () => ({ homeLink: '/page/home' }),
}))

jest.mock('@innodoc/client-store/src/selectors', () => {
  return {
    getApp: () => ({ pagePathPrefix: 'page', sectionPathPrefix: 'section' }),
  }
})

describe('withIndexRedirect', () => {
  let WithIndexRedirect
  const getContext = (asPath) => ({
    ctx: {
      asPath,
      store: {
        getState: () => {},
      },
      res: {
        end: jest.fn(),
        writeHead: jest.fn(),
      },
    },
  })

  beforeEach(() => {
    jest.clearAllMocks()
    WithIndexRedirect = withIndexRedirect(() => null)
  })

  it('should redirect index to homeLink', async () => {
    expect.assertions(4)
    const context = getContext('/')
    await WithIndexRedirect.getInitialProps(context)
    expect(context.ctx.res.writeHead).toHaveBeenCalledTimes(1)
    const [httpCode, headers] = context.ctx.res.writeHead.mock.calls[0]
    expect(httpCode).toBe(301)
    expect(headers.Location).toBe('/page/home')
    expect(context.ctx.res.end).toHaveBeenCalledTimes(1)
  })

  it('should not redirect otherwise', async () => {
    expect.assertions(2)
    const context = getContext('/some/path')
    await WithIndexRedirect.getInitialProps(context)
    expect(context.ctx.res.writeHead).not.toHaveBeenCalled()
    expect(context.ctx.res.end).not.toHaveBeenCalled()
  })
})
