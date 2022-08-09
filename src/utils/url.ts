function pageUrl(pageId: string) {
  return `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageId}`
}

export { pageUrl }
