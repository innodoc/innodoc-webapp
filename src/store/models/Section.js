import { Model, attr, fk } from 'redux-orm'

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

  static parseTOC(path, ord, node, SectionModel) {
    const currentPath = [...path, node.id]
    if (node.children !== undefined) {
      node.children.forEach(
        (child, idx) => Section.parseTOC(currentPath, [...ord, idx], child, SectionModel)
      )
    }
    SectionModel.upsert({
      id: currentPath.join('/'),
      ord,
      title: node.title,
      parentId: path.length ? path.join('/') : null,
    })
  }

  static reducer(action, SectionModel) {
    switch (action.type) {
      case actionTypes.LOAD_MANIFEST_SUCCESS:
        action.data.content.toc.forEach(
          (node, idx) => Section.parseTOC([], [idx], node, SectionModel))
        break
      case actionTypes.LOAD_SECTION_SUCCESS:
        SectionModel.upsert({
          id: action.data.contentId,
          content: {
            [action.data.language]: action.data.content,
          },
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
