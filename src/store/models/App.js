import { Model, attr, fk } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'
import { actionTypes as i18nActionTypes } from '../actions/i18n'
import { actionTypes as uiActionTypes } from '../actions/ui'

export default class App extends Model {
  static get modelName() {
    return 'App'
  }

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      contentRoot: attr({ getDefault: () => '' }),
      currentCourse: fk('Course'),
      error: attr({ getDefault: () => null }),
      language: attr({ getDefault: () => null }),
      message: attr({ getDefault: () => null }),
      sidebarVisible: attr({ getDefault: () => false }),
      staticRoot: attr({ getDefault: () => '' }),
    }
  }

  static reducer(action, AppModel) {
    const app = AppModel.first()
    if (app) {
      switch (action.type) {
        case contentActionTypes.CLEAR_ERROR:
          app.set('error', null)
          break
        case contentActionTypes.LOAD_SECTION_FAILURE:
          app.set('error', action.error)
          break
        case contentActionTypes.SET_CONTENT_ROOT:
          app.set('contentRoot', action.contentRoot)
          break
        case contentActionTypes.SET_STATIC_ROOT:
          app.set('staticRoot', action.staticRoot)
          break
        case contentActionTypes.CHANGE_COURSE:
          app.set('currentCourse', action.course.id)
          break
        case i18nActionTypes.CHANGE_LANGUAGE:
          app.set('language', action.language)
          break
        case uiActionTypes.CLEAR_MESSAGE:
          app.set('message', null)
          break
        case uiActionTypes.SHOW_MESSAGE:
          app.set('message', action.data)
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
