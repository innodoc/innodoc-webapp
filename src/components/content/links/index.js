import makeContentLink from './makeContentLink'
import pageSelectors from '../../../store/selectors/page'
import sectionSelectors from '../../../store/selectors/section'

const PageLink = makeContentLink(
  pageSelectors.makeGetPageLink,
  process.env.PAGE_PATH_PREFIX
)

const SectionLink = makeContentLink(
  sectionSelectors.makeGetSectionLink,
  process.env.SECTION_PATH_PREFIX
)

export { PageLink, SectionLink }
