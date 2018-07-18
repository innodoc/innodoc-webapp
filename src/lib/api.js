import 'isomorphic-unfetch'

export function fetchToc(baseUrl, language) {
  const url = `${baseUrl}${language}/toc.json`
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error(`Could not fetch table of contents. (Status: ${response.status} URL: ${url})`))
      }
      return response.json()
    })
}

export function fetchSection() {
  return undefined
}
