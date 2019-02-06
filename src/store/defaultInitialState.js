import orm from './orm'

const defaultInitialState = () => {
  const ormState = orm.getEmptyState()
  const session = orm.mutableSession(ormState)
  session.App.create({
    currentCourse: null,
    currentSection: null,
  })
  return { orm: ormState }
}

export default defaultInitialState
