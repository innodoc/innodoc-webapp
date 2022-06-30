import { END } from 'redux-saga'
import { put } from 'redux-saga/effects'

export default function* loadManifestFailureSaga() {
  // Stop sagas on server
  if (typeof window === 'undefined') {
    yield put(END)
  }
}
