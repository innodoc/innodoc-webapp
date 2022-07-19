import { fetchWithTimeout, getUrl } from './utils.js'

const postJson = async (url, { csrfToken, ...data }) => {
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken,
    },
    body: JSON.stringify(data),
  })

  if (response.ok) {
    return response.json()
  }

  throw new Error(response.status)
}

export const changePassword = (csrfToken, password, oldPassword) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/change-password`), {
    csrfToken,
    password,
    oldPassword,
  })

export const checkEmail = (csrfToken, email) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/check-email`), { csrfToken, email })

export const deleteAccount = (csrfToken, password) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/delete-account`), {
    csrfToken,
    password,
  })

export const loginUser = (csrfToken, email, password) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/login`), { csrfToken, email, password })

export const logoutUser = (csrfToken) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/logout`), { csrfToken })

export const persistProgress = (csrfToken, progress) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/progress`), { csrfToken, progress })

export const registerUser = (csrfToken, email, password) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/register`), {
    csrfToken,
    email,
    password,
  })

export const requestPasswordReset = (csrfToken, email) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/request-password-reset`), {
    csrfToken,
    email,
  })

export const requestVerification = (csrfToken, email) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/request-verification`), {
    csrfToken,
    email,
  })

export const resetPassword = (csrfToken, password, token) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/reset-password`), {
    csrfToken,
    password,
    token,
  })

export const verifyUser = (csrfToken, token) =>
  postJson(getUrl(process.env.NEXT_PUBLIC_APP_ROOT, `/user/verify`), { csrfToken, token })
