import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_ROUTE_NAME } from '#constants'
import type { RootState } from '#store/makeStore'
import type { RouteInfo } from '#types/common'
import type { ApiCourse } from '#types/entities/course'

interface appSliceState {
  /** Current course ID */
  courseId: ApiCourse['id'] | null

  /** Current route info */
  routeInfo: RouteInfo
}

const initialState: appSliceState = {
  courseId: null,
  routeInfo: {
    courseSlug: '',
    routeName: DEFAULT_ROUTE_NAME,
    locale: 'en',
  },
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
  },
})

/** Select app slice */
const selectApp = (state: RootState) => state[appSlice.name]

/** Select current course ID */
export const selectCourseId = (state: RootState) => selectApp(state).courseId

/** Select current route name */
export const selectRouteInfo = (state: RootState) => selectApp(state).routeInfo

export const { changeCourseId, changeRouteInfo } = appSlice.actions
export default appSlice
