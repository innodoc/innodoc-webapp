import React from 'react'
import { useSelector } from 'react-redux'

// import appSelectors from '@innodoc/client-store/src/selectors'
// import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import boxSelectors from '@innodoc/client-store/src/selectors/box'

import ChapterResults from './ChapterResults'

const Results = () => {
  // const { language } = useSelector(appSelectors.getApp)
  // const chapters = useSelector(sectionSelectors.getChapters)
  const chapters = useSelector(boxSelectors.getExerciseBoxesByChapter)

  return chapters.map((chapter) => (
    <ChapterResults
      boxes={chapter.boxes}
      key={chapter.id.toString()}
      title={chapter.title}
    />
  ))
}

export default Results
