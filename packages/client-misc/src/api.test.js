import {
  fetchFragment,
  fetchManifest,
  fetchPage,
  fetchSection,
  loginUser,
  registerUser,
} from './api'

const fetchOrig = global.fetch

const mockData = { foo: 'bar' }

afterEach(() => {
  global.fetch = fetchOrig
})

describe('getJson', () => {
  const makeTests = (name, getPromise, apiUrl) => {
    describe(name, () => {
      it('should get', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: () => mockData,
        })
        await expect(getPromise()).resolves.toEqual(mockData)
        expect(global.fetch.mock.calls[0]).toEqual([apiUrl])
      })

      it('should fail if response not ok', async () => {
        global.fetch = jest
          .fn()
          .mockResolvedValue({ ok: false, status: 404, json: () => mockData })
        await expect(getPromise()).rejects.toEqual(
          new Error(`Could not fetch JSON data. (Status: 404 URL: ${apiUrl})`)
        )
      })

      it('should fail if fetch promise rejects', async () => {
        const error = new Error('Mock error')
        global.fetch = jest.fn().mockRejectedValue(error)
        await expect(getPromise()).rejects.toEqual(error)
      })
    })
  }

  makeTests(
    'fetchFragment',
    () => fetchFragment('https://content.example.com/', 'en', '_frag01'),
    'https://content.example.com/en/_frag01.json'
  )
  makeTests(
    'fetchManifest',
    () => fetchManifest('https://content.example.com/'),
    'https://content.example.com/manifest.json'
  )
  makeTests(
    'fetchSection',
    () => fetchSection('https://content.example.com/', 'fr', 'foo/bar'),
    'https://content.example.com/fr/foo/bar/content.json'
  )
  makeTests(
    'fetchPage',
    () => fetchPage('https://content.example.com/', 'it', 'about'),
    'https://content.example.com/it/_pages/about.json'
  )
})

describe('postJson', () => {
  const makeTests = (name, getPromise, postData, apiUrl) => {
    describe(name, () => {
      it('should post', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue({ result: 'ok' }),
        })
        await expect(getPromise()).resolves.toEqual({ result: 'ok' })
        expect(global.fetch.mock.calls[0]).toEqual([
          apiUrl,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
          },
        ])
      })

      it('should fail if response not ok', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
          json: jest.fn().mockResolvedValue({ result: 'MockError' }),
        })
        await expect(getPromise()).rejects.toEqual(new Error('MockError'))
      })

      it('should fail if fetch promise rejects', async () => {
        const error = new Error('Mock error')
        global.fetch = jest.fn().mockRejectedValue(error)
        await expect(getPromise()).rejects.toEqual(error)
      })
    })
  }

  makeTests(
    'registerUser',
    () => registerUser('https://app.example.com/', 'foo@example.com', '53cr3t'),
    { email: 'foo@example.com', password: '53cr3t' },
    'https://app.example.com/user/register'
  )
  makeTests(
    'loginUser',
    () => loginUser('https://app.example.com/', 'foo@example.com', '53cr3t'),
    { email: 'foo@example.com', password: '53cr3t' },
    'https://app.example.com/user/login'
  )
})
