import React from 'react'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { showMessage } from '@innodoc/client-store/src/actions/ui'
import { parseLink } from '@innodoc/client-misc/src/util'
import getLinkInfo from '../../getLinkInfo'

import Layout from '../Layout'

const waitForCourse = (store) => new Promise((resolve, reject) => {
  const unsubscribe = store.subscribe(() => {
    const course = courseSelectors.getCurrentCourse(store.getState())
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
})

const Index = () => <Layout />

Index.getInitialProps = async (ctx) => {
  if (ctx.store && ctx.res) {
    let course
    let contentType
    let contentId
    try {
      course = await waitForCourse(ctx.store)
    } catch {
      return {} // UI message action is dispatched in saga
    }
    try {
      [contentType, contentId] = parseLink(course.homeLink)
    } catch (e) {
      ctx.store.dispatch(
        showMessage({
          title: 'Could not parse homeLink!',
          msg: e.message,
          level: 'fatal',
        })
      )
      return {}
    }
    const { pagePathPrefix, sectionPathPrefix } = appSelectors.getApp(ctx.store.getState())
    const pathPrefix = contentType === 'page' ? pagePathPrefix : sectionPathPrefix
    const linkInfo = getLinkInfo(pathPrefix, contentId)
    ctx.res.writeHead(301, { Location: linkInfo.as.pathname })
    ctx.res.end()
  }
  return {}
}

export default Index
