import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import nextI18NextConfig from '../../next.config/next-i18next.config'

const getStaticPageProps = ({ locale }) =>
  serverSideTranslations(locale, ['common'], nextI18NextConfig)

export default getStaticPageProps
