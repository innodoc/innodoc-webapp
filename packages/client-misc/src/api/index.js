import 'isomorphic-unfetch'

import { fetchFragment, fetchManifest, fetchPage, fetchProgress, fetchSection } from './get'
import {
  changePassword,
  checkEmail,
  deleteAccount,
  loginUser,
  logoutUser,
  persistProgress,
  registerUser,
  requestPasswordReset,
  requestVerification,
  resetPassword,
  verifyUser,
} from './post'

export {
  changePassword,
  checkEmail,
  deleteAccount,
  fetchFragment,
  fetchManifest,
  fetchPage,
  fetchProgress,
  fetchSection,
  loginUser,
  logoutUser,
  persistProgress,
  registerUser,
  requestPasswordReset,
  requestVerification,
  resetPassword,
  verifyUser,
}
