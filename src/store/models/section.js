import { attr, fk, Model } from 'redux-orm'

import { actionTypes } from '../actions/content'
// import { actionTypes as exerciseActionTypes } from '../actions/exercise'

export default class Section extends Model {
  static get modelName() {
    return 'Section'
  }

  static get fields() {
    return {
      id: attr(),
      ord: attr(),
      title: attr(),
      content: attr(),
      parentId: fk('Section', 'children'),
    }
  }

  static parseTOC(path, ord, node, sectionModel) {
    const currentPath = [...path, node.id]
    if (node.children !== undefined) {
      node.children.forEach(
        (child, idx) => this.parseTOC(currentPath, [...ord, idx], child, sectionModel)
      )
    }

    sectionModel.upsert({
      id: currentPath.join('/'),
      ord,
      title: node.title,
      parentId: path.join('/') === '' ? null : path.join('/'),
    })
  }

  static reducer(action, sectionModel) {
    switch (action.type) {
      case actionTypes.LOAD_MANIFEST_SUCCESS:
        // Don't parse already parsed content
        if (!action.data.parsed) {
          action.data.content.toc.forEach(
            (node, idx) => this.parseTOC([], [idx], node, sectionModel))
        }
        break
      case actionTypes.LOAD_SECTION_SUCCESS:
        sectionModel.upsert({
          id: action.data.sectionId,
          content: {
            [action.data.language]: action.data.content,
          },
        })
        break
      // TODO: Add cases for exercise actions...
      default:
        break
    }
  }
}
