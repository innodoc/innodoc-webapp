import { useAppDispatch, useAppSelector } from './hooks'
import makeStore, { AppStore, RootState } from './makeStore'
import { selectCourseTitle } from './selectors/content'
import contentApi, { selectManifest } from './slices/contentApi'
import { changeLocale, setLocales, toggleTocDrawer } from './slices/uiSlice'
import wrapper from './wrapper'

export type { AppStore, RootState }
export { makeStore, wrapper }
export { contentApi, selectManifest }
export { changeLocale, selectCourseTitle, setLocales, toggleTocDrawer }
export { useAppDispatch as useDispatch, useAppSelector as useSelector }
