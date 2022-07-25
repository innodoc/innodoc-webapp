import { makeGetSectionLink } from '@innodoc/store/selectors/section'

import makeContentLink from './makeContentLink.jsx'

const SectionLink = makeContentLink(makeGetSectionLink, 'section')

export default SectionLink
