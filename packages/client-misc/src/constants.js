import { makeSymbolObj } from './util.js'

export const MESSAGE_LEVELS = ['error', 'warning', 'info', 'success']

export const MESSAGE_TYPES = [
  'deleteAccountSuccess',
  'loadFragmentFailure',
  'loadManifestFailure',
  'loadPageFailure',
  'loadSectionFailure',
  'registerUserSuccess',
]

export const RESULT = makeSymbolObj(['NEUTRAL', 'CORRECT', 'INCORRECT'])
