import { createSelector } from 'redux-orm'

import orm from '../orm'
import appSelectors, { selectId } from '.'
import { intSortArray } from '../../lib/util'

const getIndexTerms = createSelector(
  orm, appSelectors.getOrmState, selectId,
  (session, language) => session
    .IndexTerm
    .all()
    .filter((term) => term.language === language)
    .toModelArray()
    .map((term) => {
      const { ref } = term
      return {
        ...ref,
        locations: term.locations.toRefArray().map((location) => (
          `${location.sectionId}#index-term-${location.anchorId}`
        )),
      }
    })
    .sort(intSortArray(language))
)

export default {
  getIndexTerms,
}
