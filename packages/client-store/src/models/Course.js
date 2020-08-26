import { Model, attr, oneToOne } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'

export default class Course extends Model {
  static get modelName() {
    return 'Course'
  }

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      currentPageId: oneToOne({ to: 'Page', as: 'currentPage' }),
      currentSectionId: oneToOne({ to: 'Section', as: 'currentSection' }),
      homeLink: attr(),
      languages: attr({ getDefault: () => [] }),
      logo: attr(),
      mathJaxOptions: attr({ getDefault: () => ({}) }),
      minScore: attr(),
      title: attr(),
    }
  }

  static reducer(action, CourseModel) {
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS: {
        const { content } = action.data
        CourseModel.create({
          homeLink: content.home_link || `/section/${content.toc[0].id}`,
          languages: content.languages,
          logo: content.logo || undefined,
          mathJaxOptions: content.mathjax || {},
          minScore: content.min_score,
          title: content.title,
        })
        break
      }

      case contentActionTypes.LOAD_PAGE_SUCCESS: {
        const course = CourseModel.first()
        if (course) {
          course.update({
            currentPageId: action.data.contentId,
            currentSectionId: undefined,
          })
        }
        break
      }

      case contentActionTypes.LOAD_SECTION_SUCCESS: {
        const course = CourseModel.first()
        if (course) {
          course.update({
            currentPageId: undefined,
            currentSectionId: action.data.contentId,
          })
        }
        break
      }

      case contentActionTypes.ROUTE_CHANGE_START: {
        const course = CourseModel.first()
        if (course) {
          course.update({
            currentPageId: undefined,
            currentSectionId: undefined,
          })
        }
        break
      }

      default:
        break
    }
  }
}
