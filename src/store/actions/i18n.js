export const actionTypes = {
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
  I18N_CREATED: 'I18N_CREATED',
}

export function changeLanguage(language) {
  return {
    type: actionTypes.CHANGE_LANGUAGE,
    language,
  }
}

export function i18nCreated(i18n) {
  return {
    type: actionTypes.I18N_CREATED,
    i18n,
  }
}
