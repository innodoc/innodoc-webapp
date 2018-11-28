import { ORM } from 'redux-orm'
import App from './models/app'
import Course from './models/course'
import Section from './models/section'

const orm = new ORM()
orm.register(App, Course, Section)

export default orm
