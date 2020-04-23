import { createSelector } from 'redux-orm'

import { intSortArray } from '@innodoc/client-misc/src/util'

import orm from '../orm'
import { selectId } from '.'

const getIndexTerms = createSelector(orm, selectId, (session, language) =>
  session.IndexTerm.filter((term) => term.name[language])
    .toModelArray()
    .map((term) => {
      return {
        id: term.ref.id,
        name: term.ref.name[language],
        locations: term.locations
          .filter({ language })
          .toModelArray()
          .map((loc) => ({ id: loc.id, contentId: loc.getContentId() })),
      }
    })
    .sort(intSortArray(language))
)

export default {
  getIndexTerms,
}
