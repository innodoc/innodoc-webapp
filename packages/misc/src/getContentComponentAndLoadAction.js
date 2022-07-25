import { loadPage, loadSection } from '@innodoc/store/actions/content'
import { PageContent, SectionContent } from '@innodoc/ui/content'

const contentTypes = ['page', 'section']

function getContentComponentAndLoadAction(name) {
  if (name === 'page') {
    return { ContentComponent: PageContent, loadAction: loadPage }
  }

  if (name === 'section') {
    return { ContentComponent: SectionContent, loadAction: loadSection }
  }

  throw new Error(`getContentComponentAndLoadAction: Received invalid content name ${name}`)
}

export { contentTypes }
export default getContentComponentAndLoadAction
