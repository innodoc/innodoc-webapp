import { fork, select } from 'redux-saga/effects'

import { loadToc } from './toc'
import { loadSection } from './section'
import { selectors } from '../../store/reducers/content'

// When the language changes we need to make sure to load the content.
export default function* watchChangeLanguage({ language }) {
  yield fork(loadToc, language)
  const sectionId = yield select(selectors.getCurrentSectionId)
  if (sectionId) {
    yield fork(loadSection, language, sectionId)
  }
}
