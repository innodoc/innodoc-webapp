export default async (phase, config) => {
  const pagePathPrefix = process.env.NEXT_PUBLIC_PAGE_PATH_PREFIX
  const sectionPathPrefix = process.env.NEXT_PUBLIC_SECTION_PATH_PREFIX

  const { homeLink } = config.courseManifest

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
  const destination = `/${pathPrefix}/${contentId}`

  return {
    ...config,
    redirects: async () => [
      {
        source: '/',
        destination,
        permanent: true,
      },
    ],
  }
}
