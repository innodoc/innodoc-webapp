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

export const changePassword = (base, csrfToken, password, oldPassword) =>
  postJson(`${base}user/change-password`, {
    csrfToken,
    password,
    oldPassword,
  })

export const checkEmail = (base, csrfToken, email) =>
  postJson(`${base}user/check-email`, { csrfToken, email })

export const deleteAccount = (base, csrfToken, password) =>
  postJson(`${base}user/delete-account`, { csrfToken, password })

export const loginUser = (base, csrfToken, email, password) =>
  postJson(`${base}user/login`, { csrfToken, email, password })

export const logoutUser = (base, csrfToken) => postJson(`${base}user/logout`, { csrfToken })

export const registerUser = (base, csrfToken, email, password) =>
  postJson(`${base}user/register`, { csrfToken, email, password })

export const requestPasswordReset = (base, csrfToken, email) =>
  postJson(`${base}user/request-password-reset`, { csrfToken, email })

export const requestVerification = (base, csrfToken, email) =>
  postJson(`${base}user/request-verification`, { csrfToken, email })

export const resetPassword = (base, csrfToken, password, token) =>
  postJson(`${base}user/reset-password`, { csrfToken, password, token })

export const verifyUser = (base, csrfToken, token) =>
  postJson(`${base}user/verify`, { csrfToken, token })
