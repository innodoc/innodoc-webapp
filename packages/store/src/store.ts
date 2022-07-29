import { useAppDispatch, useAppSelector } from './hooks'
import makeStore, { AppStore, RootState } from './makeStore'
import { selectCourseTitle } from './selectors/content'
import contentApi, { selectManifest } from './slices/contentApi'
import { changeLocale, toggleTocDrawer } from './slices/uiSlice'
import wrapper from './wrapper'

export type { AppStore, RootState }
export {
  changeLocale,
  contentApi,
  makeStore,
  selectCourseTitle,
  selectManifest,
  toggleTocDrawer,
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
  wrapper,
}
