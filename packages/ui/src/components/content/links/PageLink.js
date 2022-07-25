import { makeGetPageLink } from '@innodoc/store/selectors/page'

import makeContentLink from './makeContentLink.jsx'

const PageLink = makeContentLink(makeGetPageLink, 'page')

export default PageLink
