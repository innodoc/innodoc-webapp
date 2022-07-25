import { createSelector } from 'redux-orm'

import orm from '../orm.js'

import { selectId } from './misc.js'

// Return fragment by ID
export const getFragment = createSelector(orm, selectId, (session, id) => {
  const fragment = session.Fragment.withId(id)
  return fragment ? fragment.ref : undefined
})

export const getFooterA = createSelector(orm, (session) => {
  const fragment = session.Fragment.withId('_footer_a')
  return fragment ? fragment.ref : undefined
})

export const getFooterB = createSelector(orm, (session) => {
  const fragment = session.Fragment.withId('_footer_b')
  return fragment ? fragment.ref : undefined
})
