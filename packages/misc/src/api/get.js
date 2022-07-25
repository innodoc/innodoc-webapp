import camelcaseKeys from 'camelcase-keys'

import { fetchWithTimeout, getUrl } from './utils.js'

const getJson = async (url, camelcaseKeysStopPaths = undefined) => {
  const response = await fetchWithTimeout(url)

  if (response.ok) {
    const data = await response.json()

    if (typeof camelcaseKeysStopPaths === 'undefined') {
      return data
    }

    return camelcaseKeys(data, { deep: true, stopPaths: camelcaseKeysStopPaths })
  }

  throw new Error(`Could not fetch JSON data. (Status: ${response.status} URL: ${url})`)
}

export const fetchFragment = (language, fragmentId) =>
  getJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/${language}/${fragmentId}.json`))

export const fetchManifest = () =>
  getJson(getUrl(process.env.NEXT_PUBLIC_CONTENT_ROOT, '/manifest.json'), [
    'toc',
    'index_terms',
    'boxes',
  ])

export const fetchPage = (language, pageId) =>
  getJson(getUrl(process.env.NEXT_PUBLIC_CONTENT_ROOT, `/${language}/_pages/${pageId}.json`))

export const fetchProgress = () =>
  getJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/progress`))

export const fetchSection = (language, sectionId) =>
  getJson(getUrl(process.env.NEXT_PUBLIC_CONTENT_ROOT, `/${language}/${sectionId}/content.json`))
