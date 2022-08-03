import { PageContextServer } from '@/types/page'

// Extract pageId from URL
export default ({ url }: PageContextServer) => {
  const re = new RegExp(`^\/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}\/([a-zA-Z1-9_-]+)$`)
  const match = re.exec(url)
  if (match) {
    return { routeParams: { pageId: match[1] } }
  }

  return false
}
