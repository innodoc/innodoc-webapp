import { ORM } from 'redux-orm'
import Section from './models/section'

const orm = new ORM()
orm.register(Section)

export default orm
