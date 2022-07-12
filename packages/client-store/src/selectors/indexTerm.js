import { createSelector } from 'redux-orm'

import { util } from '@innodoc/client-misc'

import orm from '../orm'
import { selectId } from '.'

const getIndexTerms = createSelector(orm, selectId, (session, language) =>
  session.IndexTerm.filter((term) => term.name[language])
    .toModelArray()
    .map((term) => ({
      id: term.ref.id,
      name: term.ref.name[language],
      locations: term.locations
        .filter({ language })
        .toModelArray()
        .map((loc) => ({ id: loc.id, contentId: loc.getContentId() })),
    }))
    .sort(util.intSortArray(language))
)

export default {
  getIndexTerms,
}
