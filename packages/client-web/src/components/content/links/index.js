import pageSelectors from '@innodoc/client-store/src/selectors/page'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import makeContentLink from './makeContentLink'

const PageLink = makeContentLink(
  pageSelectors.makeGetPageLink,
  process.env.PAGE_PATH_PREFIX
)

const SectionLink = makeContentLink(
  sectionSelectors.makeGetSectionLink,
  process.env.SECTION_PATH_PREFIX
)

export { PageLink, SectionLink }
