import type { ReactNode } from 'react'
import { Alert } from '@mui/material'
import { Trans } from 'react-i18next'
import { NOT_YET_TRANSLATED_HASH } from '@innodoc/shared-core/sentinels'
import type {
  ContentWithHash,
  ContentType,
  LanguageCode,
  TranslatedCourse,
  TranslatedPage,
  TranslatedSection,
} from '@innodoc/shared-core/types'
import HastNode from '@innodoc/ui-content'
import { Code } from '@innodoc/ui-design-system/misc'
import ErrorPage from '#pages/error'

function ContentError({ contentType, contentIdValue }: ErrorProperties) {
  // The locale strings interpolate the id under its semantic name (pageSlug/sectionPath), so the
  // value's key must match the string, not the content's own field name
  const { i18nKey, contentIdKey } =
    contentType === 'page'
      ? { i18nKey: 'error.failedToLoadPage', contentIdKey: 'pageSlug' }
      : { i18nKey: 'error.failedToLoadSection', contentIdKey: 'sectionPath' }

  return (
    <ErrorPage
      errorMessage={
        <Trans components={{ 1: <Code /> }} i18nKey={i18nKey} values={{ [contentIdKey]: contentIdValue }}>
          {`Failed to load ${contentType}: <1>{{${contentIdKey}}}</1>`}
        </Trans>
      }
    />
  )
}

interface ErrorProperties {
  contentType: ContentType
  contentIdValue: string
}

/**
 * The localized "not yet translated" state: the deliberate document for a URL the course
 * promises via hreflang but whose content has no row in the document's locale yet.
 */
function NotYetTranslated() {
  return (
    <Alert variant="outlined" severity="info">
      <Trans i18nKey="content.notYetTranslated">This content has not been translated yet.</Trans>
    </Alert>
  )
}

/**
 * The shape of the content query's error this view reads: the RTK Query error is either the
 * fetch error of `fetchBaseQuery` (which carries the HTTP status) or a serialized error object
 * (which does not), so the check is a guarded read rather than a typed property.
 */
function isNotFoundQueryError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && error.status === 404
}

interface NotYetTranslatedInput {
  /** The cached course, or `undefined` while it is not in the store yet */
  course: TranslatedCourse | undefined
  /** The cached page or section, or `undefined` when the course does not list it */
  entity: TranslatedPage | TranslatedSection | undefined
  /** The document locale the content is fetched in */
  locale: LanguageCode
  /** The content query's data, or `undefined` while it has none */
  data: ContentWithHash | undefined
  /** The content query's error, if it failed */
  error: unknown
}

/**
 * Whether the route's missing content is a translation gap rather than a failure.
 *
 * All three facts must hold: the course declares the document's locale, the page or section
 * exists in the course, and the content query carries no usable content for it - either a 404
 * from the content API (client navigation), which is conclusive on its own, or the server's
 * not-yet-translated sentinel in the cached data (SSR, and the client's cache after hydration).
 * A stale cached data entry can shadow a query that just 404ed, so the 404 is checked before
 * the data. Anything else - a course without the locale, a page that does not exist, a
 * transient error - keeps the error states of today.
 */
function isContentNotYetTranslated({ course, entity, locale, data, error }: NotYetTranslatedInput): boolean {
  if (entity === undefined || course === undefined) {
    return false
  }

  if (!course.locales.includes(locale)) {
    return false
  }

  if (isNotFoundQueryError(error)) {
    return true
  }

  return data?.hash === NOT_YET_TRANSLATED_HASH
}

function ContentPage({
  children,
  contentHash,
  notYetTranslated,
  contentObj,
  contentType,
  isError,
  isLoading,
  contentIdValue,
}: ContentPageProperties) {
  if (isLoading) {
    return null
  }

  if (notYetTranslated) {
    return (
      <>
        {children}
        <NotYetTranslated />
      </>
    )
  }

  if (!contentHash) {
    return <ErrorPage is404 />
  }

  if (!contentIdValue || !contentObj) {
    return null
  }

  if (isError) {
    return <ContentError contentType={contentType} contentIdValue={contentIdValue} />
  }

  return (
    <>
      {children}
      <HastNode hash={contentHash} />
    </>
  )
}

interface ContentPageProperties {
  children: ReactNode
  contentHash?: string
  /** Whether the route's missing content is a declared-locale translation gap */
  notYetTranslated: boolean
  contentObj?: TranslatedPage | TranslatedSection
  contentType: ContentType
  isError: boolean
  isLoading: boolean
  contentIdValue?: string
}

export { isContentNotYetTranslated }
export default ContentPage
