export const actionTypes = {
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
  I18N_INSTANCE_AVAILABLE: 'I18N_INSTANCE_AVAILABLE',
}

export function changeLanguage(language) {
  return {
    type: actionTypes.CHANGE_LANGUAGE,
    language,
  }
}

export function i18nInstanceAvailable(i18n) {
  return {
    type: actionTypes.I18N_INSTANCE_AVAILABLE,
    i18n,
  }
}
