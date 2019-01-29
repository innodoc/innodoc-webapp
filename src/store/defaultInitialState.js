import orm from './orm'

const createEmptyOrmState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  // Create initial app object
  session.App.create({
    currentCourseId: null,
    currentSectionId: null,
  })
  return state
}

const defaultInitialState = {
  exercises: {},
  orm: createEmptyOrmState(),
}

export default defaultInitialState
