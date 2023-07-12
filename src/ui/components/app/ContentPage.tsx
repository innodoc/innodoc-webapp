import type { ReactNode } from 'react'
import { Trans } from 'react-i18next'

import { Page as ErrorPage } from '#renderer/_error.page'
import type { ContentType } from '#types/common'
import type { TranslatedCourse } from '#types/entities/course'
import type { TranslatedPage } from '#types/entities/page'
import type { TranslatedSection } from '#types/entities/section'
import Code from '#ui/components/common/Code'
import HastNode from '#ui/components/content/markdown/HastNode'
import { getStringIdField } from '#utils/content'

function ContentError({ contentType, stringIdValue }: ErrorProps) {
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

interface ErrorProps {
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
}: ContentPageProps) {
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

interface ContentPageProps {
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
