import { fork, takeLatest } from 'redux-saga/effects'

import watchLoadToc from './toc'
import watchLoadSection from './section'
import watchChangeLanguage from './watchChangeLanguage'
import { actionTypes as i18nActionTypes } from '../../store/actions/i18n'

export default [
  fork(watchLoadToc),
  fork(watchLoadSection),
  takeLatest(i18nActionTypes.CHANGE_LANGUAGE, watchChangeLanguage),
]
