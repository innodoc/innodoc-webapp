import { makeSymbolObj } from '@innodoc/client-misc/src/util'

export const actionTypes = makeSymbolObj([
  'CHANGE_LANGUAGE',
  'LANGUAGE_DETECTED',
])

export const changeLanguage = (language, prevLanguage = undefined) => ({
  type: actionTypes.CHANGE_LANGUAGE,
  language,
  prevLanguage,
})

export const languageDetected = (language) => ({
  type: actionTypes.LANGUAGE_DETECTED,
  language,
})
