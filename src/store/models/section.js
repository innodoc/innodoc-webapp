import { attr, fk, Model } from 'redux-orm'

import { actionTypes } from '../actions/content'

class Section extends Model {
  static get modelName() {
    return 'Section'
  }

  static get fields() {
    return {
      id: attr(),
      title: attr(),
      content: attr(),
      parent_id: fk('Section', 'children'),
    }
  }

  static parseTOC(lang, path, node, sectionModel) {
    const currentPath = [...path, node.id]
    if (node.children !== undefined) {
      node.children.forEach(child => this.parseTOC(lang, currentPath, child, sectionModel))
    }

    sectionModel.upsert({
      id: currentPath.join('/'),
      title: {
        [lang]: node.title,
      },
      parent_id: path.join('/') === '' ? null : path.join('/'),
    })
  }

  static reducer(action, sectionModel) {
    switch (action.type) {
      case actionTypes.LOAD_TOC_SUCCESS:
        action.data.content.forEach(
          node => this.parseTOC(action.data.language, [], node, sectionModel))
        break
      case actionTypes.LOAD_SECTION_SUCCESS:
        sectionModel.upsert({
          id: action.data.sectionPath,
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

export default Section
