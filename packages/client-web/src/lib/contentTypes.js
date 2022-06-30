import { loadPage, loadSection } from '@innodoc/client-store/src/actions/content'
import { PageContent, SectionContent } from '../components/content'

const contentTypes = {
  page: [PageContent, loadPage],
  section: [SectionContent, loadSection],
}

export default contentTypes
