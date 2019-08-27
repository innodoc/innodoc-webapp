import { createSelector } from 'redux-orm'

import { intSortArray } from '@innodoc/client-misc/src/util'

import orm from '../orm'
import appSelectors, { selectId } from '.'

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
