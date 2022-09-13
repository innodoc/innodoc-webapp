import { onBeforeRender as onBeforeRenderDefault } from '@/renderer/_default.page.server'
import { fetchManifest, fetchSectionContent } from '@/renderer/fetchData'
import makeStore from '@/store/makeStore'
import { selectToc } from '@/store/selectors/content/section'
import type { SectionWithChildren } from '@/types/api'
import type { PageContextServer } from '@/types/page'
import { sectionUrl } from '@/utils/content'

async function onBeforeRender(pageContext: PageContextServer) {
  const { sectionPath } = pageContext.routeParams

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass sectionPath to page component
    pageProps: { sectionPath },

    // Pass custom query to onBeforeRender
    pageQueryFactories: [(locale) => fetchSectionContent({ locale, path: sectionPath })],
  })
}

// Generate URLs for prerendering
function getUrls(sections: SectionWithChildren[], prefix: string[] = []): string[] {
  const urls: string[] = []

  sections.forEach((section) => {
    const sectionPath = [...prefix, section.id]
    urls.push(sectionUrl(sectionPath.join('/')))
    if (section.children !== undefined) {
      urls.push(...getUrls(section.children, sectionPath))
    }
  })

  return urls
}

async function prerender() {
  const store = makeStore()
  await store.dispatch(fetchManifest())
  const toc = selectToc(store.getState())
  return toc !== undefined ? getUrls(toc) : []
}

export { onBeforeRender, prerender }
