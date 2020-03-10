import makeActions from './makeActions'

export const actionTypes = makeActions(['CHANGE_LANGUAGE', 'LANGUAGE_DETECTED'])

export const changeLanguage = (language, prevLanguage = undefined) => ({
  type: actionTypes.CHANGE_LANGUAGE,
  language,
  prevLanguage,
})

export const languageDetected = (language) => ({
  type: actionTypes.LANGUAGE_DETECTED,
  language,
})
