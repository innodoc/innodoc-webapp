import { HYDRATE } from 'next-redux-wrapper'
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
        console.log('Page actionTypes.LOAD_MANIFEST_SUCCESS', action.data)
        if (action.data.pages) {
          action.data.pages.forEach((page, idx) => {
            PageModel.upsert({
              icon: page.icon,
              id: page.id,
              inFooter: page.linkInFooter,
              inNav: page.linkInNav,
              shortTitle: page.shortTitle,
              ord: idx,
              title: page.title,
            })
          })
        }
        break

      case HYDRATE:
        if (action.payload.orm.Page.itemsById) {
          Object.values(action.payload.orm.Page.itemsById).forEach((page) => PageModel.upsert(page))
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
