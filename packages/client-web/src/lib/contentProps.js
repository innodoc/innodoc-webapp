import getConfig from 'next/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { contentNotFound } from '@innodoc/client-store/src/actions/content'

import nextI18NextConfig from '../../nextConfig/next-i18next.config'
import contentTypes from './contentTypes'

const contentFragmentRegex = /^[A-Za-z0-9_:-]+$/

const { serverRuntimeConfig } = getConfig()

export const getContentPaths = () => {
  return {
    paths: [
      {
        params: {
          contentPrefix: 'page',
          fragments: ['about'],
        },
      },
    ],
    fallback: false,
  }
}

export const getContentProps = async (
  { locale, params: { contentPrefix, fragments } },
  { dispatch }
) => {
  // next-i18next
  const serverSideTranslationsProps = await serverSideTranslations(
    locale,
    undefined,
    nextI18NextConfig
  )

  const props = { ...serverSideTranslationsProps }

  // evaluate URL path
  const { pagePathPrefix, sectionPathPrefix } = serverRuntimeConfig
  const pathPrefixes = { page: pagePathPrefix, section: sectionPathPrefix }

  if (Object.keys(pathPrefixes).includes(contentPrefix)) {
    const contentType = contentPrefix === pathPrefixes.page ? 'page' : 'section'
    if (
      fragments.every((f) => contentFragmentRegex.test(f)) &&
      ((contentType === 'page' && fragments.length === 1) || contentType === 'section')
    ) {
      const [, loadAction] = contentTypes[contentType]
      dispatch(loadAction(fragments.join('/'), locale))
      return {
        ...props,
        contentType,
      }
    }
  }

  dispatch(contentNotFound())
  return props
}
