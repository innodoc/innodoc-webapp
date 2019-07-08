export const actionTypes = {
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
  LANGUAGE_DETECTED: 'LANGUAGE_DETECTED',
}

export function changeLanguage(language, prevLanguage = undefined) {
  return {
    type: actionTypes.CHANGE_LANGUAGE,
    language,
    prevLanguage,
  }
}

export function languageDetected(language) {
  return {
    type: actionTypes.LANGUAGE_DETECTED,
    language,
  }
}
