import { attr, fk, Model } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'
import { actionTypes as i18nActionTypes } from '../actions/i18n'
// import { actionTypes as exerciseActionTypes } from '../actions/exercise'
import { actionTypes as uiActionTypes } from '../actions/ui'

export default class App extends Model {
  static get modelName() {
    return 'App'
  }

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      contentRoot: attr({ getDefault: () => '' }),
      currentSectionId: fk('Section'),
      error: attr({ getDefault: () => undefined }),
      homeLink: attr({ getDefault: () => null }),
      language: attr({ getDefault: () => null }),
      languages: attr({ getDefault: () => null }),
      message: attr({ getDefault: () => null }),
      sidebarVisible: attr({ getDefault: () => false }),
      title: attr({ getDefault: () => null }),
    }
  }

  static parseManifest(app, manifest) {
    if (manifest === undefined || manifest === null) {
      throw new Error('empty manifest!')
    }

    if (manifest.homeLink) {
      // TODO: Check if homeLink is a valid sectionID
      app.set('homeLink', manifest.homeLink)
    } else {
      // NOTE: This assumes that the TOC is not empty!
      // Use first section as homeLink
      app.set('homeLink', manifest.toc[0].id)
    }

    if (manifest.languages && manifest.languages.length > 0) {
      app.set('languages', manifest.languages)
    } else {
      throw new Error('no or empty language array in manifest!')
    }

    if (manifest.title
      && manifest.title[app.language]
      && manifest.title[app.language].length > 0) {
      app.set('title', manifest.title)
    } else {
      throw new Error('no or empty course title in manifest!')
    }
  }

  static reducer(action, appModel) {
    const app = appModel.withId(0)
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS:
        this.parseManifest(app, action.data.content)
        break
      case contentActionTypes.LOAD_SECTION:
        app.set('currentSectionId', null)
        break
      case contentActionTypes.LOAD_SECTION_FAILURE:
        app.set('error', action.error)
        break
      case contentActionTypes.LOAD_SECTION_SUCCESS:
        app.set('currentSectionId', action.data.sectionId)
        break
      case contentActionTypes.SET_CONTENT_ROOT:
        app.set('contentRoot', action.contentRoot)
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
      // TODO: Add cases for exercise actions...
      default:
        break
    }
  }
}
