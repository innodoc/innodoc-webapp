import withWaitForManifest, { waitForManifest } from './withWaitForManifest'

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
  jest.clearAllMocks()
  storeCallback = undefined
  mockGetCurrentCourse = getCurrentCourse
  mockGetApp = () => ({})
})

describe('waitForManifest', () => {
  it("should return course if it's immediately available", async () => {
    expect.assertions(2)
    const returnedCourse = await waitForManifest(mockStore)
    expect(returnedCourse).toBe(course)
    expect(mockStore.subscribe).not.toHaveBeenCalled()
  })

  it('should return when course becomes available', async () => {
    expect.assertions(2)
    mockGetCurrentCourse = () => {}
    const waitForManifestPromise = waitForManifest(mockStore)
    mockStore.fakeUpdate()
    mockStore.fakeUpdate()
    mockGetCurrentCourse = getCurrentCourse
    mockStore.fakeUpdate()
    const returnedCourse = await waitForManifestPromise
    expect(returnedCourse).toBe(course)
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
  it('should wait for course', async () => {
    expect.assertions(1)
    const Component = () => null
    const WithWaitForManifest = withWaitForManifest(Component)
    const context = { ctx: { store: mockStore } }
    return expect(
      WithWaitForManifest.getInitialProps(context)
    ).resolves.toBeDefined()
  })

  it('should reject on error', async () => {
    expect.assertions(1)
    mockGetApp = () => ({ error: new Error() })
    mockGetCurrentCourse = () => {}
    const Component = () => null
    const WithWaitForManifest = withWaitForManifest(Component)
    const context = { ctx: { store: mockStore } }
    return expect(
      WithWaitForManifest.getInitialProps(context)
    ).rejects.toThrow()
  })
})
