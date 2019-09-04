import { Model, attr, fk } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'

export default class Course extends Model {
  static get modelName() {
    return 'Course'
  }

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      currentPage: fk('Page'),
      currentSection: fk('Section'),
      homeLink: attr({ getDefault: () => null }),
      languages: attr({ getDefault: () => [] }),
      logo: attr({ getDefault: () => null }),
      title: attr({ getDefault: () => null }),
    }
  }

  static reducer(action, CourseModel) {
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS: {
        const { content } = action.data
        CourseModel.create({
          currentSection: null,
          homeLink: content.home_link || `/section/${content.toc[0].id}`,
          languages: content.languages,
          logo: content.logo || null,
          title: content.title,
        })
        break
      }
      case contentActionTypes.LOAD_PAGE_SUCCESS: {
        const course = CourseModel.first()
        if (course) {
          course.set('currentSection', null)
          course.set('currentPage', action.data.contentId)
        }
        break
      }
      case contentActionTypes.LOAD_SECTION_SUCCESS: {
        const course = CourseModel.first()
        if (course) {
          course.set('currentPage', null)
          course.set('currentSection', action.data.contentId)
        }
        break
      }
      default:
        break
    }
  }
}
