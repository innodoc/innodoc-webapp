import { Model, attr } from 'redux-orm'

import { actionTypes } from '../actions/content'

export default class Page extends Model {
  static get modelName() {
    return 'Page'
  }

  static get fields() {
    return {
      id: attr(),
      content: attr(),
      icon: attr(),
      inFooter: attr({ getDefault: () => false }),
      inNav: attr({ getDefault: () => false }),
      ord: attr(),
      title: attr(),
    }
  }

  static reducer(action, PageModel) {
    switch (action.type) {
      case actionTypes.LOAD_MANIFEST_SUCCESS:
        if (action.data.content.pages) {
          action.data.content.pages.forEach(
            (page, idx) => {
              PageModel.upsert({
                id: page.id,
                icon: page.icon,
                inFooter: page.link_in_footer,
                inNav: page.link_in_nav,
                ord: idx,
                title: page.title,
              })
            }
          )
        }
        break
      case actionTypes.LOAD_PAGE_SUCCESS:
        PageModel.upsert({
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
    return this.title[language]
  }
}
