import { ORM } from 'redux-orm'
import App from './models/app'
import Course from './models/course'
import Question from './models/question'
import Section from './models/section'

const orm = new ORM()
orm.register(App, Course, Question, Section)

export default orm
