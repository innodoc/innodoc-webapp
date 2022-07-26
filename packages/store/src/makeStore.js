import { configureStore } from '@reduxjs/toolkit'

import { contentApi } from './api/contentApi.js'
import exercisesReducer from './slices/exercises.js'
import questionsReducer from './slices/questions.js'
import uiReducer from './slices/ui.js'
import userMessagesReducer from './slices/userMessages.js'

function makeStore() {
  console.log('================================================ makeStore')

  const store = configureStore({
    reducer: {
      [contentApi.reducerPath]: contentApi.reducer,
      exercises: exercisesReducer,
      questions: questionsReducer,
      ui: uiReducer,
      userMessages: userMessagesReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(contentApi.middleware),
  })

  return store
}

export default makeStore
