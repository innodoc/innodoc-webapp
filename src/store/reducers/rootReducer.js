import { combineReducers } from 'redux'

import contentReducer from './content'
import exerciseReducer from './exercise'
import uiReducer from './ui'
import i18nReducer from './i18n'

const rootReducer = combineReducers({
  content: contentReducer,
  exercises: exerciseReducer,
  ui: uiReducer,
  i18n: i18nReducer,
})

export default rootReducer
