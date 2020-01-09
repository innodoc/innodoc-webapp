// generate URL info for use with <Link /> or 'next/router'
const getLinkInfo = (pathPrefix, contentId, hash = undefined) => {
  const href = {
    pathname: `/${pathPrefix}`,
    query: { contentId },
  }
  const as = { pathname: `/${pathPrefix}/${contentId}` }
  if (hash) {
    as.hash = `#${hash}`
  }
  return { href, as }
}

export default getLinkInfo
