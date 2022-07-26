import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import nextI18NextConfig from '../../next.config/next-i18next.config.js'

const getTranslationProps = ({ locale }) =>
  serverSideTranslations(locale, ['common'], nextI18NextConfig)

export default getTranslationProps
