import 'isomorphic-unfetch'

const fetchJson = (url) =>
  fetch(url).then((response) =>
    response.ok
      ? response.json()
      : Promise.reject(
          new Error(
            `Could not fetch JSON data. (Status: ${response.status} URL: ${url})`
          )
        )
  )

const postJson = (url, data) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) =>
    response.ok
      ? response.json()
      : response
          .json()
          .then((respData) => Promise.reject(new Error(respData.result)))
  )

export const fetchFragment = (base, language, fragmentId) =>
  fetchJson(`${base}${language}/${fragmentId}.json`)

export const fetchManifest = (base) => fetchJson(`${base}manifest.json`)

export const fetchSection = (base, language, sectionId) =>
  fetchJson(`${base}${language}/${sectionId}/content.json`)

export const fetchPage = (base, language, pageId) =>
  fetchJson(`${base}${language}/_pages/${pageId}.json`)

export const registerUser = (base, email, password) =>
  postJson(`${base}user/register`, { email, password })

export const loginUser = (base, email, password) =>
  postJson(`${base}user/login`, { email, password })
