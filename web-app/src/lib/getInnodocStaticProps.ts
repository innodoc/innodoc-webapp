import type { GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { type AppStore, changeLocale, contentApi } from '@innodoc/store'

import nextI18NextConfig from '../../next-i18next.config'

async function getInnodocStaticProps(store: AppStore, { locale }: GetStaticPropsContext) {
  // Setup next-18next
  const initialLocale = locale || nextI18NextConfig.i18n.defaultLocale
  store.dispatch(changeLocale(initialLocale))
  const sstProps = await serverSideTranslations(initialLocale, ['common'])

  // Pre-fetch manifest
  void store.dispatch(contentApi.endpoints.getManifest.initiate())
  await Promise.all(contentApi.util.getRunningOperationPromises())

  return sstProps
}

export default getInnodocStaticProps
