import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import fetchContent from '#renderer/fetchContent'
import makeStore from '#store/makeStore'
import { selectToc } from '#store/selectors/content/section'
import contentApi from '#store/slices/contentApi'
import type { SectionWithChildren } from '#types/api'
import type { PageContextServer } from '#types/pageContext'
import { getSectionUrl } from '#utils/content'

async function onBeforeRender(pageContext: PageContextServer) {
  const { sectionPath } = pageContext.routeParams

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass sectionPath to page component
    pageProps: { sectionPath },

    // Pass custom prepopulation task to onBeforeRender
    pagePrepopFactories: [
      (store, locale) =>
        fetchContent(
          store,
          contentApi.endpoints.getSectionContent.initiate({ locale, path: sectionPath })
        ),
    ],
  })
}

// Generate URLs for prerendering
function getUrls(sections: SectionWithChildren[], prefix: string[] = []): string[] {
  const urls: string[] = []

  sections.forEach((section) => {
    const sectionPath = [...prefix, section.id]
    urls.push(getSectionUrl(sectionPath.join('/')))
    if (section.children !== undefined) {
      urls.push(...getUrls(section.children, sectionPath))
    }
  })

  return urls
}

async function prerender() {
  const store = makeStore()
  await store.dispatch(contentApi.endpoints.getCourse.initiate())
  const toc = selectToc(store.getState())
  return toc !== undefined ? getUrls(toc) : []
}

export { onBeforeRender, prerender }
