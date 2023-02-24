import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'

import type { RootState } from '#store/makeStore'
import type { RouteInfo } from '#types/common'
import type { ApiCourse } from '#types/entities/course'

interface appSliceState {
  /** Current course ID */
  courseId: ApiCourse['id'] | null

  /** Current route info */
  routeInfo: RouteInfo

  /** Current locale */
  locale: LanguageCode

  /** Current URL path without locale prefix */
  urlWithoutLocale: string | null
}

const initialState: appSliceState = {
  courseId: null,
  routeInfo: { routeName: 'app:root', locale: 'en' },
  locale: 'en',
  urlWithoutLocale: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    /** Change current course */
    changeCourseId(state, action: PayloadAction<ApiCourse['id']>) {
      state.courseId = action.payload
    },

    /** Change current route name */
    changeRouteInfo(state, action: PayloadAction<RouteInfo>) {
      state.routeInfo = action.payload
    },

    /** Update url info */
    changeUrlWithoutLocale(state, action: PayloadAction<string>) {
      state.urlWithoutLocale = action.payload
    },
  },
})

/** Select app slice */
const selectApp = (state: RootState) => state[appSlice.name]

/** Select current course ID */
export const selectCourseId = (state: RootState) => selectApp(state).courseId

/** Select current route name */
export const selectRouteInfo = (state: RootState) => selectApp(state).routeInfo

/** Select url info */
export const selectUrlWithoutLocale = (state: RootState) => selectApp(state).urlWithoutLocale

export const { changeCourseId, changeRouteInfo, changeUrlWithoutLocale } = appSlice.actions
export default appSlice
