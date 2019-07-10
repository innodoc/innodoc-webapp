import makeContentPage from './makeContentPage'
import { PageContent } from '../content'
import { loadPage, loadPageFailure } from '../../store/actions/content'

export default makeContentPage(
  PageContent,
  loadPage,
  loadPageFailure
)
