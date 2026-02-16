import type { ApiPage, TranslatedPage } from '@innodoc/shared-core/schemas/types'

import makeUseSelectContentUnit from './makeUseSelectContentUnit.js'

type UseSelectPage = (pageSlug?: ApiPage['slug']) => { page?: TranslatedPage }

/**
 * Select page by slug.
 *
 * @param contentId page slug
 * @returns Translated page object
 */
const useSelectPage = makeUseSelectContentUnit<ApiPage>('page') as UseSelectPage

export default useSelectPage
