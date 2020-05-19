import { ORM } from 'redux-orm'

import App from './models/App'
import Box from './models/Box'
import Course from './models/Course'
import Fragment from './models/Fragment'
import IndexTerm from './models/IndexTerm'
import IndexTermLocation from './models/IndexTermLocation'
import Page from './models/Page'
import Question from './models/Question'
import Section from './models/Section'
import UserMessage from './models/UserMessage'

const orm = new ORM({ stateSelector: (state) => state.orm })
orm.register(
  App,
  Box,
  Course,
  Fragment,
  IndexTerm,
  IndexTermLocation,
  Page,
  Question,
  Section,
  UserMessage
)

export default orm
