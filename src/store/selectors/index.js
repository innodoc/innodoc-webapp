import { createSelector } from 'redux-orm'

import orm from '../orm'

const getOrmState = state => state.orm

const getApp = createSelector(
  orm, getOrmState,
  session => session.App.first().ref
)

export default {
  getApp,
  getOrmState,
}
