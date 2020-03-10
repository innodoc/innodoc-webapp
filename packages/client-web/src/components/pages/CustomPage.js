import { loadPage } from '@innodoc/client-store/src/actions/content'

import makeContentPage from './makeContentPage'
import { PageContent } from '../content'

export default makeContentPage(PageContent, loadPage)
