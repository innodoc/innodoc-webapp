import { combineReducers } from 'redux'
import { createReducer } from 'redux-orm'

import exerciseReducer from './exercise'
import orm from '../orm'

const rootReducer = combineReducers({
  exercises: exerciseReducer,
  db: createReducer(orm),
})

export default rootReducer
