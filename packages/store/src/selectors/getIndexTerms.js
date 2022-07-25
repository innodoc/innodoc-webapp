import { createSelector } from 'redux-orm'

import { intSortArray } from '@innodoc/misc/utils'

import orm from '../orm.js'

import { selectId } from './misc.js'

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
    .sort(intSortArray(language))
)

export default getIndexTerms
