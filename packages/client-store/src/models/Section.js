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
      title: attr(),
      type: attr(),
      content: attr(),
      parentId: fk('Section', 'children'),
      visited: attr({ getDefault: () => false }),
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
      title: node.title,
      type: node.type || 'regular',
      parentId: path.length ? path.join('/') : undefined,
    })
  }

  static reducer(action, SectionModel) {
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS:
        action.data.content.toc.forEach((node, idx) =>
          Section.parseTOC([], [idx], node, SectionModel)
        )
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
        break

      default:
        break
    }
  }

  getDisplayTitle(language) {
    const ordString = this.ord.reduce((acc, secOrd) => {
      const prefix = acc === '' ? '' : `${acc}.`
      return `${prefix}${secOrd + 1}`
    }, '')
    return `${ordString} ${this.title[language]}`
  }
}
