import { attr, fk, Model } from 'redux-orm'

import { actionTypes } from '../actions/content'

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

  static parseTOC(lang, path, ord, node, sectionModel) {
    const currentPath = [...path, node.id]
    if (node.children !== undefined) {
      node.children.forEach(
        (child, idx) => this.parseTOC(lang, currentPath, [...ord, idx], child, sectionModel)
      )
    }

    sectionModel.upsert({
      id: currentPath.join('/'),
      ord,
      title: {
        [lang]: node.title,
      },
      parentId: path.join('/') === '' ? null : path.join('/'),
    })
  }

  static reducer(action, sectionModel) {
    switch (action.type) {
      case actionTypes.LOAD_TOC_SUCCESS:
        // Don't parse already parsed content
        if (!action.data.parsed) {
          action.data.content.forEach(
            (node, idx) => this.parseTOC(action.data.language, [], [idx], node, sectionModel))
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
      default:
        break
    }
  }
}
