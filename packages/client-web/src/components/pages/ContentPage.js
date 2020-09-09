import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import getConfig from 'next/config'
import { useServerContext } from 'next-server-context'

import MathJax from '@innodoc/react-mathjax-node'

import { contentType as contentPropType } from '@innodoc/client-misc/src/propTypes'
import {
  // contentNotFound,
  loadPage,
  loadPageSuccess,
  loadSection,
  loadSectionSuccess,
} from '@innodoc/client-store/src/actions/content'
import appSelectors from '@innodoc/client-store/src/selectors'

import { PageContent, SectionContent } from '../content'
import Layout from '../Layout'
import ErrorPage from './ErrorPage'

const { serverRuntimeConfig } = getConfig()

const contentTypes = {
  page: [PageContent, loadPage, loadPageSuccess],
  section: [SectionContent, loadSection, loadSectionSuccess],
}

const ContentPage = ({ content, contentType, title }) => {
  const [ContentComponent, loadAction, loadActionSuccess] = contentTypes[contentType]
  // const serverContext = useServerContext()
  // const { show404 } = useSelector(appSelectors.getApp)

  // const dispatch = useDispatch()
  // useEffect(() => {
  //   const action = content ? loadActionSuccess(content) : loadAction()
  //   dispatch(action)
  // }, [content])

  // if (show404) {
  //   if (serverContext) {
  //     serverContext.response.statusCode = 404
  //   }
  //   return <ErrorPage statusCode={404} />
  // }

  return (
    <Layout>
      <MathJax.Provider>
        <ContentComponent content={content} title={title} />
      </MathJax.Provider>
    </Layout>
  )
}

// ContentPage.getInitialProps = ({ query: { fragments, contentPrefix }, store }) => {
//   console.log('ContentPage.getInitialProps')
//   const { language, pagePathPrefix, sectionPathPrefix } = appSelectors.getApp(store.getState())
//   console.log(pagePathPrefix, sectionPathPrefix)

//   const pathPrefixes = { page: pagePathPrefix, section: sectionPathPrefix }

//   if (Object.keys(pathPrefixes).includes(contentPrefix)) {
//     if (fragments.every((f) => contentFragmentRegex.test(f))) {
//       const contentType = contentPrefix === pathPrefixes.page ? 'page' : 'section'
//       const [ContentComponent, loadAction] = contentTypes[contentType]
//       const actionContentId = contentType === 'section' ? fragments.join('/') : fragments[0]
//       store.dispatch(loadAction(actionContentId, language))
//       return { ContentComponent }
//     }
//   }

//   store.dispatch(contentNotFound())
//   return {}
// }

const getStaticPaths = async () => {
  const { manifest, sectionPathPrefix, pagePathPrefix } = serverRuntimeConfig

  const pageParams = manifest.pages.map((p) => ({
    params: { contentPrefix: pagePathPrefix, fragments: [p.id] },
  }))

  const getSectionParams = (sections, section, parentIds) => {
    const fragments = [...parentIds, section.id]
    const sectionParams = {
      params: { contentPrefix: sectionPathPrefix, fragments },
    }
    const childrenParams = section.children
      ? section.children.reduce((acc, s) => getSectionParams(acc, s, fragments), [])
      : []
    return [...sections, sectionParams, ...childrenParams]
  }
  const sectionParams = manifest.toc.reduce((acc, s) => getSectionParams(acc, s, []), [])

  // console.log('getStaticPaths')
  // console.log(JSON.stringify(sectionParams, null, 2))

  return {
    paths: [...pageParams, ...sectionParams],
    fallback: false, // 404 for other routes
  }
}

const getStaticProps = async ({ params: { contentPrefix, fragments } }) => {
  console.log('getStaticProps', contentPrefix, fragments)
  const { contentRoot, manifest, pagePathPrefix } = serverRuntimeConfig
  const url = new URL(contentRoot)
  let contentType
  let title
  if (contentPrefix === pagePathPrefix) {
    contentType = 'page'
    title = manifest.pages.find((p) => p.id === fragments[0]).title.en
    url.pathname = `/en/_pages/${fragments[0]}.json`
  } else {
    contentType = 'section'
    title = 'TODO'
    const path = fragments.join('/')
    url.pathname = `/en/${path}/content.json`
  }

  const res = await fetch(url.toString())
  const content = await res.json()
  console.log('getStaticProps', url.toString(), content)
  return { props: { content, contentType, title } }
}

ContentPage.defaultProps = {
  content: null,
  contentType: null,
  title: null,
}

ContentPage.propTypes = {
  content: contentPropType,
  contentType: PropTypes.oneOf(Object.keys(contentTypes)),
  title: PropTypes.string,
}

export { getStaticPaths, getStaticProps }
export default ContentPage
