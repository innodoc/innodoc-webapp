import { ORM } from 'redux-orm'
import App from './models/App'
import Course from './models/Course'
import Page from './models/Page'
import Question from './models/Question'
import Section from './models/Section'

const orm = new ORM()
orm.register(
  App,
  Course,
  Page,
  Question,
  Section,
)

export default orm
