import 'isomorphic-unfetch'

const fetchJson = (url) => fetch(url)
  .then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`Could not fetch JSON data. (Status: ${response.status} URL: ${url})`))
    }
    return response.json()
  })

export const fetchFragment = (contentRoot, language, fragmentId) => fetchJson(`${contentRoot}${language}/${fragmentId}.json`)
export const fetchManifest = (contentRoot) => fetchJson(`${contentRoot}manifest.json`)
export const fetchSection = (contentRoot, language, sectionId) => fetchJson(`${contentRoot}${language}/${sectionId}/content.json`)
export const fetchPage = (contentRoot, language, pageId) => fetchJson(`${contentRoot}${language}/_pages/${pageId}.json`)
