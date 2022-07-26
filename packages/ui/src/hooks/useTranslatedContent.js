import { useTranslation } from 'next-i18next'

const useTranslatedContent = () => {
  const { i18n } = useTranslation()
  const { language } = i18n

  return (content) => {
    try {
      return content[language]
    } catch {
      return ''
    }
  }
}

export default useTranslatedContent
