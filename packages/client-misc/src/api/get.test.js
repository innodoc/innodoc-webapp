import { fetchFragment, fetchManifest, fetchPage, fetchProgress, fetchSection } from './get'

const fetchOrig = global.fetch

afterEach(() => {
  global.fetch = fetchOrig
})

const mockData = { foo: 'bar' }
const appBase = 'https://app.example.com/'
const contentBase = 'https://content.example.com/'

describe('getJson', () => {
  const makeTests = (name, getPromise, apiUrl) => {
    describe(name, () => {
      it('should get', async () => {
        expect.assertions(2)
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: () => mockData,
        })
        await expect(getPromise()).resolves.toEqual(mockData)
        expect(global.fetch.mock.calls[0]).toEqual([apiUrl])
      })

      it('should fail if response not ok', async () => {
        expect.assertions(1)
        global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404, json: () => mockData })
        await expect(getPromise()).rejects.toEqual(
          new Error(`Could not fetch JSON data. (Status: 404 URL: ${apiUrl})`)
        )
      })

      it('should fail if fetch promise rejects', async () => {
        expect.assertions(1)
        const error = new Error('Mock error')
        global.fetch = jest.fn().mockRejectedValue(error)
        await expect(getPromise()).rejects.toEqual(error)
      })
    })
  }

  makeTests(
    'fetchFragment',
    () => fetchFragment(contentBase, 'en', '_frag01'),
    'https://content.example.com/en/_frag01.json'
  )

  makeTests(
    'fetchManifest',
    () => fetchManifest(contentBase),
    'https://content.example.com/manifest.json'
  )

  makeTests(
    'fetchSection',
    () => fetchSection(contentBase, 'fr', 'foo/bar'),
    'https://content.example.com/fr/foo/bar/content.json'
  )

  makeTests('fetchProgress', () => fetchProgress(appBase), 'https://app.example.com/user/progress')

  makeTests(
    'fetchPage',
    () => fetchPage(contentBase, 'it', 'about'),
    'https://content.example.com/it/_pages/about.json'
  )
})
