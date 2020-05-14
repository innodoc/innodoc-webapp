import { loadManifest } from '@innodoc/client-store/src/actions/content'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import createHoc from './createHoc'

const waitForManifest = (store) =>
  new Promise((resolve, reject) => {
    let course = courseSelectors.getCurrentCourse(store.getState())
    if (course) {
      resolve()
    } else {
      const unsubscribe = store.subscribe(() => {
        course = courseSelectors.getCurrentCourse(store.getState())
        if (course) {
          unsubscribe()
          resolve()
        } else {
          const { error } = appSelectors.getApp(store.getState())
          if (error) {
            unsubscribe()
            reject(error)
          }
        }
      })
    }
  })

const withWaitForManifest = createHoc('WithWaitForManifest', (ctx) => {
  ctx.store.dispatch(loadManifest())
  return Promise.race([
    waitForManifest(ctx.store),
    new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId)
        reject(new Error('Could not retrieve course manifest!'))
      }, 2000)
    }),
  ])
})

export { waitForManifest }
export default withWaitForManifest
