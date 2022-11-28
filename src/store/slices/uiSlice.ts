import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'

import type { RootState } from '#store/makeStore'
import type { ApiCourse } from '#types/entities/course'

interface UiSliceState {
  /** Current course ID */
  courseId: ApiCourse['id'] | null

  /** Current locale */
  locale: LanguageCode

  /** Current URL path without locale prefix */
  urlWithoutLocale: string | null
}

const initialState: UiSliceState = {
  courseId: null,
  locale: 'en',
  urlWithoutLocale: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {
    /** Change current course */
    changeCourseId(state, action: PayloadAction<ApiCourse['id']>) {
      state.courseId = action.payload
    },

    /** Change locale */
    changeLocale(state, action: PayloadAction<LanguageCode>) {
      state.locale = action.payload
    },

    /** Update url info */
    changeUrlWithoutLocale(state, action: PayloadAction<string>) {
      state.urlWithoutLocale = action.payload
    },
  },
})

/** Select ui slice */
const selectUi = (state: RootState) => state[uiSlice.name]

/** Select current course ID */
export const selectCourseId = (state: RootState) => selectUi(state).courseId

/** Select current locale */
export const selectLocale = (state: RootState) => selectUi(state).locale

/** Select url info */
export const selectUrlWithoutLocale = (state: RootState) => selectUi(state).urlWithoutLocale

/** Select current section path */
export const selectCurrentSectionPath = (state: RootState) => {
  const urlWithoutLocale = selectUrlWithoutLocale(state)
  return urlWithoutLocale?.startsWith(`/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
    ? urlWithoutLocale.substring(import.meta.env.INNODOC_SECTION_PATH_PREFIX.length + 2)
    : undefined
}

export const { changeCourseId, changeLocale, changeUrlWithoutLocale } = uiSlice.actions
export default uiSlice
