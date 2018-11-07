import { ORM } from 'redux-orm'
import App from './models/app'
import Section from './models/section'

const orm = new ORM()
orm.register(App, Section)

export default orm
