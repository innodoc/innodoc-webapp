const mockT = (s, interp) => {
  let ret = s
  if (Array.isArray(s)) {
    ret = s.join('_')
  }
  if (interp) {
    ret += Object.values(interp).reduce((acc, v) => `${acc}_${v}`, '')
  }
  return ret
}
const i18n = { t: mockT }
const appWithTranslation = (Comp) => Comp
const useTranslation = () => ({ t: mockT })
const Trans = ({ children }) => children

export { appWithTranslation, i18n, useTranslation, Trans }
export default i18n
