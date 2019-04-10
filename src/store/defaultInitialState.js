import orm from './orm'

// create the initial (and only) instance of App
const defaultInitialState = () => {
  const session = orm.session(orm.getEmptyState())
  session.App.create({ currentCourse: null })
  return { orm: session.state }
}

export default defaultInitialState
