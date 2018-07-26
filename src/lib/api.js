import 'isomorphic-unfetch'

function fetchJson(url, accept404 = false) {
  return fetch(url)
    .then((response) => {
      if (accept404 && response.status === 404) {
        return accept404
      }
      if (!response.ok) {
        return Promise.reject(new Error(`Could not fetch JSON data. (Status: ${response.status} URL: ${url})`))
      }
      return response.json()
    })
}

export function fetchToc(language) {
  const url = `${process.env.CONTENT_ROOT}${language}/toc.json`
  return fetchJson(url)
}

export function fetchSection(sectionId, language) {
  // 404 is ok and means section doesn't have any content
  const url = `${process.env.CONTENT_ROOT}${language}/${sectionId}/content.json`
  return fetchJson(url, [])
}