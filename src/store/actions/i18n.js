export const actionTypes = {
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
  LANGUAGE_DETECTED: 'LANGUAGE_DETECTED',
}

export function changeLanguage(language) {
  return {
    type: actionTypes.CHANGE_LANGUAGE,
    language,
  }
}

export function languageDetected(language) {
  return {
    type: actionTypes.LANGUAGE_DETECTED,
    language,
  }
}
