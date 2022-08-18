import contentApi, {
  type PageContentFetchArgs,
  type ContentFetchArgs,
  SectionContentFetchArgs,
} from '@/store/slices/contentApi'

function fetchContent(args: ContentFetchArgs) {
  return contentApi.endpoints.getContent.initiate(args)
}

function fetchManifest() {
  return contentApi.endpoints.getManifest.initiate()
}

function fetchPageContent(args: PageContentFetchArgs) {
  return contentApi.endpoints.getPageContent.initiate(args)
}

function fetchSectionContent(args: SectionContentFetchArgs) {
  return contentApi.endpoints.getSectionContent.initiate(args)
}

export { fetchContent, fetchManifest, fetchPageContent, fetchSectionContent }
