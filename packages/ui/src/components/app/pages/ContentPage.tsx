import { Trans } from 'react-i18next'
import type { ReactNode } from 'react'

import type { ContentType } from '@innodoc/types/common'
import type { TranslatedCourse, TranslatedPage, TranslatedSection } from '@innodoc/types/entities'

import { Code } from '#components/common/misc'
import { HastNode } from '#components/content/hast'
import { getStringIdField } from '#utils'

import ErrorPage from './ErrorPage'

function ContentError({ contentType, stringIdValue }: ErrorProperties) {
  const stringIdField = getStringIdField(contentType)

  return (
    <ErrorPage
      errorMsg={
        <Trans
          components={{ 1: <Code /> }}
          i18nKey={`error.failedToLoad${contentType === 'page' ? 'Page' : 'Section'}`}
          values={{ [stringIdField]: stringIdValue }}
        >
          {`Failed to load ${contentType}: <1>{{${stringIdField}}}</1>`}
        </Trans>
      }
    />
  )
}

interface ErrorProperties {
  contentType: ContentType
  stringIdValue: string
}

function ContentPage({
  children,
  contentHash,
  contentObj,
  contentType,
  course,
  isError,
  isLoading,
  stringIdValue,
}: ContentPageProperties) {
  if (isLoading) {
    return null
  }

  if (course === undefined) {
    return <ErrorPage is404 />
  }

  if (stringIdValue === undefined || contentObj === undefined) {
    return null
  }

  if (isError) {
    return <ContentError contentType={contentType} stringIdValue={stringIdValue} />
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
  course?: TranslatedCourse
  isError: boolean
  isLoading: boolean
  stringIdValue?: string
}

export default ContentPage
