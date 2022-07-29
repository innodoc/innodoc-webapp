import { createSelector } from '@reduxjs/toolkit'

import { selectManifest } from '../slices/contentApi'

export const selectCourseTitle = createSelector(selectManifest, (manifest) => {
  console.log('manifest?.title', manifest?.title)
  return manifest?.title
})
