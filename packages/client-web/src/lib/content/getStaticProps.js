// - Prepare content props for SSR
// - Add next-i18next specific props

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import nextI18NextConfig from '../../../next.config/next-i18next.config'
import contentTypes from './contentTypes'

const contentFragmentRegex = /^[A-Za-z0-9_:-]+$/

const pathPrefixes = {
  page: process.env.PAGE_PATH_PREFIX,
  section: process.env.SECTION_PATH_PREFIX,
}

const getContentType = (contentPrefix, fragments) => {
  if (Object.keys(pathPrefixes).includes(contentPrefix)) {
    const contentType = contentPrefix === pathPrefixes.page ? 'page' : 'section'
    if (fragments.every((f) => contentFragmentRegex.test(f))) {
      const [, loadAction] = contentTypes[contentType]
      return [contentType, loadAction]
    }
  }
  throw new Error(`getStaticProps: Could not parse content URL: ${contentPrefix} ${fragments}`)
}

const getStaticProps = async ({ locale, params: { contentPrefix, fragments } }, { dispatch }) => {
  // next-i18next
  const serverSideTranslationsProps = await serverSideTranslations(
    locale,
    ['common'],
    nextI18NextConfig
  )

  const props = { ...serverSideTranslationsProps }

  // Evaluate URL path and fetch content
  const [contentType, loadAction] = getContentType(contentPrefix, fragments)
  dispatch(loadAction(fragments.join('/'), locale))

  return {
    ...props,
    contentType,
  }
}

export default getStaticProps
