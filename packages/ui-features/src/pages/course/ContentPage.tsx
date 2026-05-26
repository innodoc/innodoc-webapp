import type { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import type { ContentType, TranslatedPage, TranslatedSection } from '@innodoc/shared-core/types'
import HastNode from '@innodoc/ui-content'
import { Code } from '@innodoc/ui-design-system/misc'
import { getContentIdField } from '@innodoc/ui-design-system/utils'
import ErrorPage from '#pages/error'

function ContentError({ contentType, contentIdValue }: ErrorProperties) {
  const contentIdField = getContentIdField(contentType)

  return (
    <ErrorPage
      errorMsg={
        <Trans
          components={{ 1: <Code /> }}
          i18nKey={`error.failedToLoad${contentType === 'page' ? 'Page' : 'Section'}`}
          values={{ [contentIdField]: contentIdValue }}
        >
          {`Failed to load ${contentType}: <1>{{${contentIdField}}}</1>`}
        </Trans>
      }
    />
  )
}

interface ErrorProperties {
  contentType: ContentType
  contentIdValue: string
}

function ContentPage({
  children,
  contentHash,
  contentObj,
  contentType,
  isError,
  isLoading,
  contentIdValue,
}: ContentPageProperties) {
  if (isLoading) {
    return null
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
  contentObj?: TranslatedPage | TranslatedSection
  contentType: ContentType
  isError: boolean
  isLoading: boolean
  contentIdValue?: string
}

export default ContentPage
