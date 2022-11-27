import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import fetchContent from '#renderer/fetchContent'
import sections from '#store/slices/entities/sections'
import type { PageContextServer } from '#types/pageContext'

async function onBeforeRender(pageContext: PageContextServer) {
  const { sectionPath } = pageContext.routeParams

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass sectionPath to page component
    pageProps: { sectionPath },

    // Pass custom prepopulation task to onBeforeRender
    pagePrepopFactories: [
      // TODO
      // (store, locale) =>
      //   fetchContent(
      //     store,
      //     sections.endpoints.getSectionContent.initiate({
      //       courseName: pageContext.courseName,
      //       locale,
      //       path: sectionPath, // TODO need section id here
      //     })
      //   ),
    ],
  })
}

// Generate URLs for prerendering
// function getUrls(sections: TranslatedSection[], prefix: string[] = []): string[] {
//   const urls: string[] = []

//   sections.forEach((section) => {
//     const sectionPath = [...prefix, section.id]
//     urls.push(getSectionUrl(sectionPath.join('/')))
//     if (section.children !== undefined) {
//       urls.push(...getUrls(section.children, sectionPath))
//     }
//   })

//   return urls
// }

async function prerender() {
  // TODO
  // const store = makeStore()
  // await store.dispatch(contentApi.endpoints.getCourse.initiate())
  // const toc = selectToc(store.getState())
  // return toc !== undefined ? getUrls(toc) : []
}

export { onBeforeRender, prerender }
