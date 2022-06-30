import { Model, attr, fk } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'
import { actionTypes as userActionTypes } from '../actions/user'

export default class Section extends Model {
  static get modelName() {
    return 'Section'
  }

  static get fields() {
    return {
      id: attr(),
      ord: attr(),
      shortTitle: attr(),
      title: attr(),
      type: attr(),
      content: attr(),
      parentId: fk('Section', 'children'),
      visited: attr({ getDefault: () => false }),
      testScore: attr(), // Only relevant if type=test, testScore=undefined means not submitted
    }
  }

  static parseTOC(path, ord, node, SectionModel) {
    const currentPath = [...path, node.id]
    if (node.children !== undefined) {
      node.children.forEach((child, idx) =>
        Section.parseTOC(currentPath, [...ord, idx], child, SectionModel)
      )
    }
    SectionModel.upsert({
      id: currentPath.join('/'),
      ord,
      shortTitle: node.short_title || null,
      title: node.title,
      type: node.type || 'regular',
      parentId: path.length ? path.join('/') : null,
    })
  }

  static reducer(action, SectionModel) {
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS:
        action.data.toc.forEach((node, idx) => Section.parseTOC([], [idx], node, SectionModel))
        break

      case contentActionTypes.LOAD_SECTION_SUCCESS:
        SectionModel.upsert({
          id: action.data.contentId,
          content: {
            [action.data.language]: action.data.content,
          },
        })
        break

      case contentActionTypes.SECTION_VISIT:
        SectionModel.withId(action.sectionId).set('visited', true)
        break

      case userActionTypes.CLEAR_PROGRESS:
        SectionModel.all()
          .toModelArray()
          .forEach((section) => section.set('visited', false))
        break

      case userActionTypes.LOAD_PROGRESS:
        action.visitedSections.forEach((id) => {
          const section = SectionModel.withId(id)
          if (section) {
            section.set('visited', true)
          }
        })
        Object.keys(action.testScores).forEach((id) => {
          const section = SectionModel.withId(id)
          if (section) {
            section.set('testScore', action.testScores[id])
          }
        })
        break

      case userActionTypes.RESET_TEST:
        SectionModel.withId(action.sectionId).set('testScore', undefined)
        break

      case userActionTypes.TEST_SCORE:
        SectionModel.withId(action.sectionId).set('testScore', action.score)
        break

      default:
        break
    }
  }

  getDisplayTitle(language, preferShort = false) {
    const ordString = this.ord.reduce((acc, secOrd) => {
      const prefix = acc === '' ? '' : `${acc}.`
      return `${prefix}${secOrd + 1}`
    }, '')
    const title =
      preferShort && this.shortTitle && this.shortTitle[language]
        ? this.shortTitle[language]
        : this.title[language]
    return `${ordString} ${title}`
  }
}
