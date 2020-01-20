import { createSelector } from 'redux-orm'

import orm from '../orm'
import { selectId } from '.'

// Return fragment by ID
const getFragment = createSelector(orm, selectId, (session, id) => {
  const fragment = session.Fragment.withId(id)
  return fragment ? fragment.ref : undefined
})

const getFooterA = createSelector(orm, (session) => {
  const fragment = session.Fragment.withId('_footer_a')
  return fragment ? fragment.ref : undefined
})

const getFooterB = createSelector(orm, (session) => {
  const fragment = session.Fragment.withId('_footer_b')
  return fragment ? fragment.ref : undefined
})

export default {
  getFooterA,
  getFooterB,
  getFragment,
}
