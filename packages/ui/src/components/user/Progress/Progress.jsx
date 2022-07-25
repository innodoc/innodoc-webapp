import { Alert } from 'antd'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'

import { getCurrentCourse } from '@innodoc/store/src/selectors/course'
import { getProgress } from '@innodoc/store/src/selectors/progress'

import ChapterCard from './ChapterCard.jsx'
import css from './Progress.module.sss'

function Progress() {
  const { t } = useTranslation()
  const { minScore } = useSelector(getCurrentCourse)
  const chapters = useSelector(getProgress)

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
