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

const postJson = (url, { csrfToken, ...data }) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken,
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

export const checkEmail = (base, csrfToken, email) =>
  postJson(`${base}user/check-email`, { csrfToken, email })

export const verifyUser = (base, csrfToken, token) =>
  postJson(`${base}user/verify`, { csrfToken, token })

export const registerUser = (base, csrfToken, email, password) =>
  postJson(`${base}user/register`, { csrfToken, email, password })

export const changePassword = (base, csrfToken, email, password, oldPassword) =>
  postJson(`${base}user/change-password`, {
    csrfToken,
    email,
    password,
    oldPassword,
  })

export const resetPassword = (base, csrfToken, password, token) =>
  postJson(`${base}user/reset-password`, { csrfToken, password, token })

export const requestPasswordReset = (base, csrfToken, email) =>
  postJson(`${base}user/request-password-reset`, { csrfToken, email })

export const requestVerification = (base, csrfToken, email) =>
  postJson(`${base}user/request-verification`, { csrfToken, email })

export const loginUser = (base, csrfToken, email, password) =>
  postJson(`${base}user/login`, { csrfToken, email, password })

export const logoutUser = (base, csrfToken) =>
  postJson(`${base}user/logout`, { csrfToken })
