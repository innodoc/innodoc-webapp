import { loadSection } from '@innodoc/client-store/src/actions/content'

import makeContentPage from './makeContentPage'
import { SectionContent } from '../content'

export default makeContentPage(SectionContent, loadSection)
