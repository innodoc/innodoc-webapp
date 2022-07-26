// Generate list of dynamic content paths for SSG
// https://nextjs.org/docs/basic-features/data-fetching/get-static-paths

import { fetchManifest } from '@innodoc/misc/api'

const generatePageParams = (pages) =>
  pages.map(({ id }) => ({
    params: {
      contentPrefix: process.env.NEXT_PUBLIC_PAGE_PATH_PREFIX,
      fragments: [id],
    },
  }))

const generateSectionParams = (sections, parentIds = []) =>
  sections.reduce((acc, { id, children }) => {
    const sectionParams = {
      params: {
        contentPrefix: process.env.NEXT_PUBLIC_SECTION_PATH_PREFIX,
        fragments: [...parentIds, id],
      },
    }

    if (Array.isArray(children)) {
      return [...acc, sectionParams, ...generateSectionParams(children, [...parentIds, id])]
    }
    return [...acc, sectionParams]
  }, [])

const getStaticPaths = async () => {
  // TODO, fetch via store
  // const store = makeStore()
  // const { data: manifest } = await store.dispatch(getManifest.initiate())

  const manifest = await fetchManifest()

  return {
    paths: [...generatePageParams(manifest.pages), ...generateSectionParams(manifest.toc)],
    fallback: false,
  }
}

export default getStaticPaths
