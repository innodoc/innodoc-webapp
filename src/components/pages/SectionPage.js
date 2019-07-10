import makeContentPage from './makeContentPage'
import { SectionContent } from '../content'
import { loadSection, loadSectionFailure } from '../../store/actions/content'

export default makeContentPage(
  SectionContent,
  loadSection,
  loadSectionFailure
)
