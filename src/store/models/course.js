import { attr, fk, Model } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'

export default class Course extends Model {
  static get modelName() {
    return 'Course'
  }

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      currentSection: fk('Section'),
      homeLink: attr({ getDefault: () => null }),
      languages: attr({ getDefault: () => [] }),
      title: attr({ getDefault: () => null }),
    }
  }

  static reducer(action, courseModel) {
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS: {
        const { content } = action.data
        courseModel.create({
          currentSection: null,
          homeLink: content.homeLink || content.toc[0].id,
          languages: content.languages,
          title: content.title,
        })
        break
      }
      case contentActionTypes.LOAD_SECTION: {
        const course = courseModel.first()
        if (course) {
          course.set('currentSection', null)
        }
        break
      }
      case contentActionTypes.LOAD_SECTION_SUCCESS: {
        const course = courseModel.first()
        if (course) {
          course.set('currentSection', action.data.sectionId)
        }
        break
      }
      default:
        break
    }
  }
}
