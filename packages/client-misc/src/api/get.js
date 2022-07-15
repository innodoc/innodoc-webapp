import camelcaseKeys from 'camelcase-keys'
import fetch from 'cross-fetch'

const getJson = async (inputUrl, camelcaseKeysStopPaths = undefined) => {
  const url = new URL(inputUrl, process.env.NEXT_PUBLIC_APP_ROOT)
  const response = await fetch(url)
  if (response.ok) {
    const data = await response.json()

    if (typeof camelcaseKeysStopPaths === 'undefined') {
      return data
    }

    return camelcaseKeys(data, { deep: true, stopPaths: camelcaseKeysStopPaths })
  }

  throw new Error(`Could not fetch JSON data. (Status: ${response.status} URL: ${url})`)
}

export const fetchFragment = (language, fragmentId) => getJson(`/${language}/${fragmentId}.json`)

export const fetchManifest = () => getJson(`/manifest.json`, ['toc', 'index_terms', 'boxes'])

export const fetchPage = (language, pageId) => getJson(`/${language}/_pages/${pageId}.json`)

export const fetchProgress = () => getJson(`/user/progress`)

export const fetchSection = (language, sectionId) =>
  getJson(`/${language}/${sectionId}/content.json`)
