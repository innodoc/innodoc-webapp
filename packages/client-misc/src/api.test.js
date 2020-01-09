import { fetchManifest, fetchSection } from './api'

const fetchOrig = global.fetch

afterEach(() => {
  global.fetch = fetchOrig
})

describe('fetchManifest', () => {
  const manifestData = { foo: 'bar' }

  it('should fetch', async () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          resolve({
            ok: true,
            json: () => manifestData,
          })
        )
    )
    expect.assertions(2)
    await expect(
      fetchManifest('https://content.example.com/')
    ).resolves.toEqual(manifestData)
    expect(global.fetch.mock.calls).toEqual([
      ['https://content.example.com/manifest.json'],
    ])
  })

  it('should fail if response not ok', async () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          resolve({
            ok: false,
            status: 404,
            json: () => manifestData,
          })
        )
    )
    expect.assertions(1)
    await expect(fetchManifest('https://content.example.com/')).rejects.toEqual(
      new Error(
        'Could not fetch JSON data. (Status: 404 URL: https://content.example.com/manifest.json)'
      )
    )
  })

  it('should fail if fetch promise rejects', async () => {
    global.fetch = jest.fn(
      () => new Promise((resolve, reject) => reject(new Error('Dummy error')))
    )
    expect.assertions(1)
    await expect(fetchManifest('https://content.example.com/')).rejects.toEqual(
      new Error('Dummy error')
    )
  })
})

describe('fetchSection', () => {
  const contentData = ['content']
  it('should fetch', async () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          resolve({
            ok: true,
            json: () => contentData,
          })
        )
    )
    expect.assertions(2)
    await expect(
      fetchSection('https://content.example.com/', 'fr', 'foo/bar')
    ).resolves.toEqual(contentData)
    expect(global.fetch.mock.calls).toEqual([
      ['https://content.example.com/fr/foo/bar/content.json'],
    ])
  })
})
