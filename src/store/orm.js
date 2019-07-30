import { ORM } from 'redux-orm'
import App from './models/App'
import Course from './models/Course'
import Fragment from './models/Fragment'
import Page from './models/Page'
import Question from './models/Question'
import Section from './models/Section'

const orm = new ORM()
orm.register(
  App,
  Course,
  Fragment,
  Page,
  Question,
  Section,
)

export default orm
