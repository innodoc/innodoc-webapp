import { Model, attr } from 'redux-orm'

import { actionTypes } from '../actions/content'

export default class Page extends Model {
  static get modelName() {
    return 'Page'
  }

  static get fields() {
    return {
      content: attr(),
      icon: attr(),
      id: attr(),
      inFooter: attr({ getDefault: () => false }),
      inNav: attr({ getDefault: () => false }),
      shortTitle: attr(),
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
                icon: page.icon,
                id: page.id,
                inFooter: page.link_in_footer,
                inNav: page.link_in_nav,
                shortTitle: page.short_title,
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
