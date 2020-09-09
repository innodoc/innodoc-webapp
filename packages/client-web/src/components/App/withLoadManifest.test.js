import { loadManifest } from '@innodoc/client-store/src/actions/content'
import withWaitForManifest, { waitForManifest } from './withWaitForManifest'

// TODO

let mockGetCurrentCourse
jest.mock('@innodoc/client-store/src/selectors/course', () => ({
  getCurrentCourse: () => mockGetCurrentCourse(),
}))

let mockGetApp
jest.mock('@innodoc/client-store/src/selectors', () => {
  const actualSelectors = jest.requireActual('@innodoc/client-store/src/selectors')
  return {
    ...actualSelectors,
    getApp: () => mockGetApp(),
  }
})

let storeCallback
const mockStore = {
  dispatch: jest.fn(),
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
  jest.clearAllMocks()
  storeCallback = undefined
  mockGetCurrentCourse = getCurrentCourse
  mockGetApp = () => ({})
})

describe('waitForManifest', () => {
  it('should resolve when course is immediately available', async () => {
    expect.assertions(2)
    await expect(waitForManifest(mockStore)).resolves.toBeUndefined()
    expect(mockStore.subscribe).not.toHaveBeenCalled()
  })

  it('should resolve once course becomes available', async () => {
    expect.assertions(2)
    mockGetCurrentCourse = () => {}
    const waitForManifestPromise = waitForManifest(mockStore)
    mockStore.fakeUpdate()
    mockStore.fakeUpdate()
    mockGetCurrentCourse = getCurrentCourse
    mockStore.fakeUpdate()
    await expect(waitForManifestPromise).resolves.toBeUndefined()
    expect(mockStore.subscribe).toBeCalledTimes(1)
  })

  it('should reject with error', async () => {
    expect.assertions(2)
    const error = new Error('foo')
    mockGetApp = () => ({ error })
    mockGetCurrentCourse = () => {}
    const waitForManifestPromise = waitForManifest(mockStore)
    mockStore.fakeUpdate()
    await expect(waitForManifestPromise).rejects.toBe(error)
    expect(mockStore.subscribe).toBeCalledTimes(1)
  })
})

describe('withWaitForManifest', () => {
  const Component = () => null
  const context = { ctx: { store: mockStore } }
  let WithWaitForManifest

  beforeEach(() => {
    WithWaitForManifest = withWaitForManifest(Component)
  })

  it('should trigger loading of course manifest', async () => {
    expect.assertions(1)
    await WithWaitForManifest.getInitialProps(context)
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadManifest())
  })

  it('should wait for course', () => {
    expect.assertions(1)
    return expect(WithWaitForManifest.getInitialProps(context)).resolves.toEqual(expect.any(Object))
  })

  it('should reject on error', () => {
    expect.assertions(1)
    mockGetApp = () => ({ error: new Error() })
    mockGetCurrentCourse = () => {}
    return expect(WithWaitForManifest.getInitialProps(context)).rejects.toThrow()
  })
})
