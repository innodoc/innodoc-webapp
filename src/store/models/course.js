import { attr, fk, Model } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'

export default class Course extends Model {
  static get modelName() {
    return 'Course'
  }

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      currentSectionId: fk('Section'),
      homeLink: attr({ getDefault: () => null }),
      languages: attr({ getDefault: () => [] }),
      title: attr({ getDefault: () => null }),
    }
  }

  static parseManifest(app, courseModel, manifest) {
    if (manifest === undefined || manifest === null) {
      throw new Error('empty manifest!')
    }

    // TODO: Check if homeLink is a valid sectionID
    // NOTE: This assumes that the TOC is not empty!
    // Use first section as homeLink if homeLink is not given
    const homeLink = manifest.homeLink ? manifest.homeLink : manifest.toc[0].id

    // courseModel.set('languages', manifest.languages)
    if (manifest.languages && manifest.languages.length <= 0) {
      throw new Error('no or empty language array in manifest!')
    }

    // app.set('title', manifest.title)
    if (!manifest.title
      || !manifest.title[app.language]
      || manifest.title[app.language].length <= 0) {
      throw new Error('no or empty course title in manifest!')
    }

    // Check if course already exists
    courseModel.create({
      currentSectionId: null,
      homeLink,
      languages: manifest.languages,
      title: manifest.title,
    })
  }

  static reducer(action, courseModel, session) {
    const { App: appModel } = session

    let app = appModel.withId(0)
    let course
    if (app && app.currentCourseId) {
      app = app.ref
      course = courseModel.withId(app.currentCourseId)
    }

    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS:
        if (!action.data.parsed) {
          this.parseManifest(app, courseModel, action.data.content)
        }
        break
      case contentActionTypes.LOAD_SECTION:
        if (course) {
          course.set('currentSectionId', null)
        }
        break
      case contentActionTypes.LOAD_SECTION_SUCCESS:
        if (course) {
          course.set('currentSectionId', action.data.sectionId)
        }
        break
      default:
        break
    }
  }
}
