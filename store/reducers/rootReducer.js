import { combineReducers } from 'redux'

import contentReducer from './content'
import exerciseReducer from './exercise'
import uiReducer from './ui'

const rootReducer = combineReducers({
  content: contentReducer,
  exercises: exerciseReducer,
  ui: uiReducer,
})

export default rootReducer
