import type { Store } from '@/store/makeStore'
import contentApi, {
  type PageContentFetchArgs,
  type ContentFetchArgs,
  SectionContentFetchArgs,
} from '@/store/slices/contentApi'

function fetchContent(store: Store, args: ContentFetchArgs) {
  return store.dispatch(contentApi.endpoints.getContent.initiate(args))
}

function fetchManifest(store: Store) {
  return store.dispatch(contentApi.endpoints.getManifest.initiate())
}

function fetchPageContent(store: Store, args: PageContentFetchArgs) {
  return store.dispatch(contentApi.endpoints.getPageContent.initiate(args))
}

function fetchSectionContent(store: Store, args: SectionContentFetchArgs) {
  return store.dispatch(contentApi.endpoints.getSectionContent.initiate(args))
}

export { fetchContent, fetchManifest, fetchPageContent, fetchSectionContent }
