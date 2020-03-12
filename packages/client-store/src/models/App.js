import { Model, attr, oneToOne } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'
import { actionTypes as i18nActionTypes } from '../actions/i18n'
import { actionTypes as uiActionTypes } from '../actions/ui'
import { actionTypes as userActionTypes } from '../actions/user'

export default class App extends Model {
  static get modelName() {
    return 'App'
  }

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      appRoot: attr(),
      contentRoot: attr({ getDefault: () => '' }),
      currentCourseId: oneToOne({
        to: 'Course',
        as: 'currentCourse',
      }),
      language: attr(),
      loggedInEmail: attr(),
      show404: attr({ getDefault: () => false }),
      sidebarVisible: attr({ getDefault: () => false }),
      staticRoot: attr({ getDefault: () => '' }),
    }
  }

  static reducer(action, AppModel) {
    const app = AppModel.first()
    if (app) {
      switch (action.type) {
        case contentActionTypes.SET_SERVER_CONFIGURATION:
          app.update(action.config)
          break
        case contentActionTypes.CHANGE_COURSE:
          app.set('currentCourseId', action.course.id)
          break
        case contentActionTypes.CONTENT_NOT_FOUND:
          app.set('show404', true)
          break
        case contentActionTypes.ROUTE_CHANGE_START:
          app.set('show404', false)
          break
        case i18nActionTypes.CHANGE_LANGUAGE:
          app.set('language', action.language)
          break
        case userActionTypes.USER_LOGGED_IN:
          app.set('loggedInEmail', action.email)
          break
        case userActionTypes.USER_LOGGED_OUT:
          app.set('loggedInEmail', undefined)
          break
        case uiActionTypes.TOGGLE_SIDEBAR: {
          app.set('sidebarVisible', !app.sidebarVisible)
          break
        }
        default:
          break
      }
    }
  }
}
