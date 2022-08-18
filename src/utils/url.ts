function pageUrl(pageId: string) {
  return `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageId}`
}

function replacePathPrefixes(url: string) {
  return url
    .replace('/page/', `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/`)
    .replace('/section/', `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
}

export { pageUrl, replacePathPrefixes }
