import 'isomorphic-unfetch'

const getJson = (url) =>
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
    response.ok ? response.json() : Promise.reject(new Error(response.status))
  )

export const fetchFragment = (base, language, fragmentId) =>
  getJson(`${base}${language}/${fragmentId}.json`)

export const fetchManifest = (base) => getJson(`${base}manifest.json`)

export const fetchSection = (base, language, sectionId) =>
  getJson(`${base}${language}/${sectionId}/content.json`)

export const fetchPage = (base, language, pageId) =>
  getJson(`${base}${language}/_pages/${pageId}.json`)

export const checkEmail = (base, email) =>
  postJson(`${base}user/checkEmail`, { email })

export const registerUser = (base, email, password) =>
  postJson(`${base}user/register`, { email, password })

export const loginUser = (base, email, password) =>
  postJson(`${base}user/login`, { email, password })
