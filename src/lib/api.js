import 'isomorphic-unfetch'

const fetchJson = url => fetch(url)
  .then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`Could not fetch JSON data. (Status: ${response.status} URL: ${url})`))
    }
    return response.json()
  })

const fetchManifest = contentRoot => fetchJson(`${contentRoot}manifest.json`)
const fetchSection = (contentRoot, language, sectionId) => fetchJson(`${contentRoot}${language}/${sectionId}/content.json`)
const fetchPage = (contentRoot, language, pageId) => fetchJson(`${contentRoot}${language}/_pages/${pageId}.json`)

export { fetchManifest, fetchPage, fetchSection }
