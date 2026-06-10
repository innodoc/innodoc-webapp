import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'
import makeUseSelectContentUnit from './make-use-select-content-unit.js'

type UseSelectSection = (sectionSlug?: ApiSection['path']) => { section?: TranslatedSection }

/**
 * Select section by path.
 *
 * @param contentId section path
 * @returns Translates section
 */
const useSelectSection = makeUseSelectContentUnit<ApiSection>('section') as UseSelectSection

export default useSelectSection
