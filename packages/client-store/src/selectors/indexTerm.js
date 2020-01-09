import { createSelector } from 'redux-orm'

import { intSortArray } from '@innodoc/client-misc/src/util'

import orm from '../orm'
import { selectId } from '.'

const getIndexTerms = createSelector(orm, selectId, (session, language) =>
  session.IndexTerm.all()
    .filter((term) => term.language === language)
    .toModelArray()
    .map((term) => {
      const { ref } = term
      return {
        ...ref,
        locations: term.locations.toRefArray().map((location) => location.id),
      }
    })
    .sort(intSortArray(language))
)

export default {
  getIndexTerms,
}
