import React from 'react'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

const waitForManifest = (store) =>
  new Promise((resolve, reject) => {
    let course = courseSelectors.getCurrentCourse(store.getState())
    if (course) {
      resolve(course)
    } else {
      const unsubscribe = store.subscribe(() => {
        course = courseSelectors.getCurrentCourse(store.getState())
        if (course) {
          unsubscribe()
          resolve(course)
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

const withWaitForManifest = (WrappedComponent) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const WithWaitForManifest = (props) => <WrappedComponent {...props} />

  WithWaitForManifest.getInitialProps = async (ctx) => {
    let wrappedComponentProps = { pageProps: {} }
    if (WrappedComponent.getInitialProps) {
      wrappedComponentProps = await WrappedComponent.getInitialProps(ctx)
    }

    await Promise.race([
      waitForManifest(ctx.ctx.store),
      new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId)
          reject(new Error('Could not retrieve course manifest!'))
        }, 2000)
      }),
    ])

    return {
      ...wrappedComponentProps,
    }
  }

  const wrappedDisplayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithWaitForManifest.displayName = `WithInnodocPreparation(${wrappedDisplayName})`

  return WithWaitForManifest
}

export { waitForManifest } // for testing
export default withWaitForManifest
