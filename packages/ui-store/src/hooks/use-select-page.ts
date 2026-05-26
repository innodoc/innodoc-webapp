import type { ApiPage, TranslatedPage } from '@innodoc/shared-core/types'
import makeUseSelectContentUnit from './make-use-select-content-unit.js'

type UseSelectPage = (pageSlug?: ApiPage['slug']) => { page?: TranslatedPage }

/**
 * Select page by slug.
 *
 * @param contentId page slug
 * @returns Translated page object
 */
const useSelectPage = makeUseSelectContentUnit<ApiPage>('page') as UseSelectPage

export default useSelectPage
