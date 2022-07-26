// import { makeGetPageLink } from '@innodoc/store/selectors/page'

import makeContentLink from './makeContentLink.jsx'

const makeGetPageLink = () => () => 'page'
const PageLink = makeContentLink(makeGetPageLink, 'page')

export default PageLink
