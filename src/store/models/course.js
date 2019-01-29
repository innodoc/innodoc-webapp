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

  static parseManifest(courseModel, manifest) {
    if (manifest === undefined || manifest === null) {
      throw new Error('Empty manifest!')
    }

    // TODO: Check if homeLink is a valid sectionID
    // NOTE: This assumes that the TOC is not empty!
    // Use first section as homeLink if homeLink is not given
    const homeLink = manifest.homeLink ? manifest.homeLink : manifest.toc[0].id

    if (manifest.languages && manifest.languages.length <= 0) {
      throw new Error('No or empty language array in manifest!')
    }
    if (!manifest.title) {
      throw new Error('No course title in manifest!')
    }
    manifest.languages.forEach((language) => {
      if (!manifest.title[language] || manifest.title[language].length <= 0) {
        throw new Error(`Could not find title (${language}) in manifest!`)
      }
    })

    // Check if course already exists
    courseModel.create({
      currentSectionId: null,
      homeLink,
      languages: manifest.languages,
      title: manifest.title,
    })
  }

  static reducer(action, courseModel, session) {
    const app = session.App.first()
    let course
    if (app && app.currentCourseId) {
      course = courseModel.withId(app.ref.currentCourseId)
    }

    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS:
        if (!action.data.parsed) {
          this.parseManifest(courseModel, action.data.content)
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
