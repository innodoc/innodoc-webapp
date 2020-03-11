export const MESSAGE_LEVELS = ['error', 'warning', 'info', 'success']

export const MESSAGE_TYPES_MODAL = [
  'loadFragmentFailure',
  'loadManifestFailure',
  'loadPageFailure',
  'loadSectionFailure',
  'registerUserSuccess',
]

export const MESSAGE_TYPES_LOGIN = ['loginUserFailure']

export const MESSAGE_TYPES_REGISTER = ['registerUserFailure']

export const MESSAGE_TYPES = [
  ...MESSAGE_TYPES_MODAL,
  ...MESSAGE_TYPES_LOGIN,
  ...MESSAGE_TYPES_REGISTER,
]
