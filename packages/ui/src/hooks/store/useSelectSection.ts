import type { ApiSection, TranslatedSection } from '@innodoc/types/entities'

import makeUseSelectContentUnit from './makeUseSelectContentUnit'

type UseSelectSection = (sectionSlug?: ApiSection['path']) => { section?: TranslatedSection }

/**
 * Select section by path.
 *
 * @param contentId section path
 * @returns Translates section
 */
const useSelectSection = makeUseSelectContentUnit<ApiSection>('section') as UseSelectSection

export default useSelectSection
