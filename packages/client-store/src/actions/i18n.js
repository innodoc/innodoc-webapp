// TODO: rename language->locale everywhere according to next.js convention

import { makeSymbolObj } from '@innodoc/client-misc/src/util'

export const actionTypes = makeSymbolObj(['CHANGE_LANGUAGE', 'LANGUAGE_DETECTED', 'SET_I18NEXT'])

export const changeLanguage = (language, prevLanguage = undefined) => ({
  type: actionTypes.CHANGE_LANGUAGE,
  language,
  prevLanguage,
})

// TODO: remove languageDetected (replaced by setI18next)
export const languageDetected = (language) => ({
  type: actionTypes.LANGUAGE_DETECTED,
  language,
})

export const setI18next = (i18next, language) => ({
  type: actionTypes.SET_I18NEXT,
  i18next,
  language,
})
