import type { ApiPage, TranslatedPage } from '@innodoc/schema/types'

import makeUseSelectContentUnit from './makeUseSelectContentUnit'

type UseSelectPage = (pageSlug?: ApiPage['slug']) => { page?: TranslatedPage }

/**
 * Select page by slug.
 *
 * @param contentId page slug
 * @returns Translated page object
 */
const useSelectPage = makeUseSelectContentUnit<ApiPage>('page') as UseSelectPage

export default useSelectPage
