import { Trans } from 'react-i18next'
import type { ReactNode } from 'react'

import { Code } from '@innodoc/components-common/misc'
import { getContentIdField } from '@innodoc/components-common/utils'
import HastNode from '@innodoc/components-content'
import type { TranslatedPage, TranslatedSection } from '@innodoc/schema/types'
import type { ContentType } from '@innodoc/types/common'

import ErrorPage from '#error'

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
