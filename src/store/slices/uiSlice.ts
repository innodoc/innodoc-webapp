import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'

import type { ApiCourse } from '#types/api'

interface UiSliceState {
  /** Current course name */
  courseName: ApiCourse['name'] | null

  /** Current locale */
  locale: LanguageCode

  /** Current URL path without locale prefix */
  urlWithoutLocale: string | null
}

const initialState: UiSliceState = {
  courseName: null,
  locale: 'en',
  urlWithoutLocale: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {
    /** Change current course */
    changeCourseName(state, action: PayloadAction<ApiCourse['name']>) {
      state.courseName = action.payload
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

export const { changeCourseName, changeLocale, changeUrlWithoutLocale } = uiSlice.actions
export default uiSlice
