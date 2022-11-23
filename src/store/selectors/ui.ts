import type { RootState } from '#store/makeStore'
import uiSlice from '#store/slices/uiSlice'

/** Select ui slice */
const selectUi = (state: RootState) => state[uiSlice.name]

/** Select current course name */
export const selectCourseName = (state: RootState) => selectUi(state).courseName

/** Select current locale */
export const selectLocale = (state: RootState) => selectUi(state).locale

/** Select url info */
export const selectUrlWithoutLocale = (state: RootState) => selectUi(state).urlWithoutLocale
