import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import fetchContent from '#renderer/fetchContent'
import { getSectionIdByPath } from '#server/database/queries/sections'
import sections from '#store/slices/entities/sections'
import type { PageContextServer, PrepopFactory } from '#types/pageContext'

async function onBeforeRender(pageContext: PageContextServer) {
  const {
    courseId,
    routeParams: { sectionPath },
  } = pageContext

  // Need to fetch section ID for this path
  const sectionId = await getSectionIdByPath(courseId, sectionPath)

  const pagePrepopFactories: PrepopFactory[] =
    sectionId !== undefined
      ? [
          // Fetch section content
          (store, locale) =>
            fetchContent(
              store,
              sections.endpoints.getSectionContent.initiate({
                courseId,
                locale,
                sectionId,
              })
            ),
        ]
      : []

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass sectionPath to page component
    pageProps: { sectionPath },

    // Pass custom prepopulation task to onBeforeRender
    pagePrepopFactories,
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
