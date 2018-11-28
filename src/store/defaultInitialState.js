import orm from './orm'

const createEmptyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const { App } = session

  // Creating default app state
  App.create({
    currentCourseId: null,
    currentSectionId: null,
  })

  return state
}

const defaultInitialState = {
  exercises: {},
  db: createEmptyState(),
}

export default defaultInitialState
