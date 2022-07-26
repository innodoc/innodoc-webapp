// - Prepare content props for SSR
// - Add next-i18next specific props

import { getPage, getSection, getRunningOperationPromises } from '@innodoc/store/api/content'

import getTranslationProps from '../getTranslationProps.js'

const contentFragmentRegex = /^[A-Za-z0-9_:-]+$/

const pathPrefixes = {
  page: process.env.NEXT_PUBLIC_PAGE_PATH_PREFIX,
  section: process.env.NEXT_PUBLIC_SECTION_PATH_PREFIX,
}

const parsePath = (contentPrefix, fragments) => {
  if (Object.keys(pathPrefixes).includes(contentPrefix)) {
    const contentType = contentPrefix === pathPrefixes.page ? 'page' : 'section'

    if (contentType === 'page' && fragments.length === 1) {
      return { contentType, getAction: getPage, pathname: fragments[0] }
    }

    if (contentType === 'section' && fragments.every((f) => contentFragmentRegex.test(f))) {
      return { contentType, getAction: getSection, pathname: fragments.join('/') }
    }
  }
  throw new Error(`getStaticProps: Could not parse content URL: ${contentPrefix} ${fragments}`)
}

const getStaticProps = async (context, { dispatch }) => {
  const {
    locale,
    params: { contentPrefix, fragments },
  } = context

  // Parse URL path
  const { contentType, getAction, pathname } = parsePath(contentPrefix, fragments)

  // Fetch content
  dispatch(getAction.initiate({ locale, pathname }))
  await Promise.all(getRunningOperationPromises())

  return {
    ...(await getTranslationProps(context)),
    contentType,
  }
}

export default getStaticProps
