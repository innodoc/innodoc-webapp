const mockT = (s) => {
  if (Array.isArray(s)) {
    return s.join('_')
  }
  return s
}
const i18n = { t: mockT }
const appWithTranslation = (Comp) => Comp
const useTranslation = () => ({ t: mockT })
const Trans = ({ children }) => children

export { appWithTranslation, i18n, useTranslation, Trans }
export default i18n
