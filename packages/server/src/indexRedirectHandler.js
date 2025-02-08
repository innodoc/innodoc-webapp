// Redirect / to custom homeLink. (Next.js does support redirects out-of-the-box
// but homeLink would need to be known at build time for this to work.)
const indexRedirectHandler = ({ manifest, pagePathPrefix, sectionPathPrefix }) => {
  const { homeLink } = manifest
  let contentType
  let contentId

  if (homeLink.startsWith('/page/')) {
    contentType = 'page'
    contentId = homeLink.slice(6)
  } else if (homeLink.startsWith('/section/')) {
    contentType = 'section'
    contentId = homeLink.slice(9)
  } else {
    throw new Error(
      `Malformed home_link encountered. Must start with either '/page/' or '/section/'. Got ${homeLink}`
    )
  }
  const pathPrefix = contentType === 'page' ? pagePathPrefix : sectionPathPrefix
  const dest = `/${pathPrefix}/${contentId}`

  return (req, res) => res.redirect(308, dest)
}

export default indexRedirectHandler
