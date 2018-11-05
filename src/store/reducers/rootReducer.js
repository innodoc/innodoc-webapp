import { combineReducers } from 'redux'
import { createReducer } from 'redux-orm'

import contentReducer from './content'
import exerciseReducer from './exercise'
import uiReducer from './ui'
import i18nReducer from './i18n'
import orm from '../orm'

const rootReducer = combineReducers({
  content: contentReducer,
  exercises: exerciseReducer,
  ui: uiReducer,
  i18n: i18nReducer,
  db: createReducer(orm),
})

export default rootReducer
