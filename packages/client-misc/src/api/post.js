import fetch from 'cross-fetch'

const postJson = async (inputUrl, { csrfToken, ...data }) => {
  const url = new URL(inputUrl, process.env.NEXT_PUBLIC_APP_ROOT)
  const response = await fetch(url, {
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
  postJson(`/user/change-password`, {
    csrfToken,
    password,
    oldPassword,
  })

export const checkEmail = (csrfToken, email) => postJson(`/user/check-email`, { csrfToken, email })

export const deleteAccount = (csrfToken, password) =>
  postJson(`/user/delete-account`, { csrfToken, password })

export const loginUser = (csrfToken, email, password) =>
  postJson(`/user/login`, { csrfToken, email, password })

export const logoutUser = (csrfToken) => postJson(`/user/logout`, { csrfToken })

export const persistProgress = (csrfToken, progress) =>
  postJson(`/user/progress`, { csrfToken, progress })

export const registerUser = (csrfToken, email, password) =>
  postJson(`/user/register`, { csrfToken, email, password })

export const requestPasswordReset = (csrfToken, email) =>
  postJson(`/user/request-password-reset`, { csrfToken, email })

export const requestVerification = (csrfToken, email) =>
  postJson(`/user/request-verification`, { csrfToken, email })

export const resetPassword = (csrfToken, password, token) =>
  postJson(`/user/reset-password`, { csrfToken, password, token })

export const verifyUser = (csrfToken, token) => postJson(`/user/verify`, { csrfToken, token })
