import {combineReducers} from 'redux'

import contentReducer from './content'
import exerciseReducer from './exercise'
import uiReducer from './ui'

const rootReducer = combineReducers({
  content: contentReducer,
  exercise: exerciseReducer,
  ui: uiReducer,
})

export default rootReducer
