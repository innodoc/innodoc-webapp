import { createSelector } from '@reduxjs/toolkit'

import { selectManifest } from '../api/contentApi.js'

export const selectCourse = createSelector(selectManifest, (manifest) => {
  console.log('selectCourse typeof manifest:', typeof manifest)

  return {
    homeLink: manifest?.home_link,
    languages: manifest?.languages,
    logo: manifest?.logo,
    mathJaxOptions: manifest?.mathjax,
    minScore: manifest?.min_score,
    title: manifest?.title,
  }
})

export const selectFooterA = () => {}
export const selectFooterB = () => {}

// export const selectFooterA = () => ({
//   content: {
//     de: '',
//     en: '',
//   },
// })

// export const selectFooterB = () => ({
//   content: {
//     de: '',
//     en: '',
//   },
// })
