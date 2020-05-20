import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import css from './style.sss'

import ChapterCard from './ChapterCard'

const Results = () => {
  const { t } = useTranslation()
  const chapters = useSelector(sectionSelectors.getChapters)
  const minScore = 90 // TODO: make minScore configurable through app

  const chapterCards = chapters.map((chapter) => (
    <ChapterCard
      key={chapter.id.toString()}
      sectionId={chapter.id}
      title={chapter.title}
    />
  ))

  return (
    <>
      <Alert
        className={css.info}
        description={t('results.introduction.description', { minScore })}
        message={t('results.introduction.message')}
        type="info"
        showIcon
      />
      {chapterCards}
    </>
  )
}

export default Results
