import { END } from 'redux-saga'
import { put } from 'redux-saga/effects'

export default function* changeCourseSaga() {
  // Stop sagas on server
  if (typeof window === 'undefined') {
    console.log('Stopping sagas on server')
    yield put(END)
  }
}
