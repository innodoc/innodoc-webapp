import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'antd'

import { useTranslation } from '@innodoc/common/src/i18n'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import progressSelectors from '@innodoc/client-store/src/selectors/progress'
import css from './style.sss'

import ChapterCard from './ChapterCard'

const Progress = () => {
  const { t } = useTranslation()
  const { minScore } = useSelector(courseSelectors.getCurrentCourse)
  const chapters = useSelector(progressSelectors.getProgress)

  const chapterCards = chapters.map((chapter) => (
    <ChapterCard
      key={chapter.id.toString()}
      minScore={minScore}
      progress={chapter.progress}
      sectionId={chapter.id}
      title={chapter.title}
    />
  ))

  return (
    <>
      <Alert
        className={css.info}
        description={t('progress.introduction.description', { minScore })}
        message={t('progress.introduction.message')}
        type="info"
        showIcon
      />
      {chapterCards}
    </>
  )
}

export default Progress
