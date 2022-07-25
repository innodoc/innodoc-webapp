import { ORM } from 'redux-orm'

import App from './models/App.js'
import Course from './models/Course.js'
import Exercise from './models/Exercise.js'
import Fragment from './models/Fragment.js'
import IndexTerm from './models/IndexTerm.js'
import IndexTermLocation from './models/IndexTermLocation.js'
import Page from './models/Page.js'
import Question from './models/Question.js'
import Section from './models/Section.js'
import UserMessage from './models/UserMessage.js'

const orm = new ORM({ stateSelector: (state) => state.orm })
orm.register(
  App,
  Course,
  Exercise,
  Fragment,
  IndexTerm,
  IndexTermLocation,
  Page,
  Question,
  Section,
  UserMessage
)

export default orm
