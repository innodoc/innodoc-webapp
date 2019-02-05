import orm from './orm'

const defaultInitialState = () => {
  const ormState = orm.getEmptyState()
  const session = orm.mutableSession(ormState)
  session.App.create({
    currentCourseId: null,
    currentSectionId: null,
  })
  return { orm: ormState }
}

export default defaultInitialState
