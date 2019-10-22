import { createSelector } from 'redux-orm'

import orm from '../orm'
import { selectId } from '.'

// Return fragment by ID
const getFragment = createSelector(
  orm, selectId,
  (session, id) => {
    const fragment = session.Fragment.withId(id)
    return fragment ? fragment.ref : null
  }
)

const getFooterA = createSelector(
  orm,
  (session) => {
    const fragment = session.Fragment.withId('_footer_a')
    return fragment ? fragment.ref : null
  }
)

const getFooterB = createSelector(
  orm,
  (session) => {
    const fragment = session.Fragment.withId('_footer_b')
    return fragment ? fragment.ref : null
  }
)

export default {
  getFooterA,
  getFooterB,
  getFragment,
}
