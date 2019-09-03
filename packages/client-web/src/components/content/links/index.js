import pageSelectors from '@innodoc/client-store/src/selectors/page'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import makeContentLink from './makeContentLink'

const PageLink = makeContentLink(pageSelectors.makeGetPageLink, 'page')
const SectionLink = makeContentLink(sectionSelectors.makeGetSectionLink, 'section')

export { PageLink, SectionLink }
