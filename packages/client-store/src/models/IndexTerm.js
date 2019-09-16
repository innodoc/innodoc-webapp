import { Model, attr } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'

export default class IndexTerm extends Model {
  static get modelName() {
    return 'IndexTerm'
  }

  static get fields() {
    return {
      id: attr(),
      language: attr(),
      name: attr(),
    }
  }

  static reducer(action, IndexTermModel, session) {
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS: {
        const indexTerms = action.data.content.index_terms
        if (indexTerms) {
          Object.keys(indexTerms).forEach((language) => {
            const indexTermLang = indexTerms[language]
            Object.keys(indexTermLang).forEach((indexTermId) => {
              const [name, locations] = indexTermLang[indexTermId]
              IndexTermModel.upsert({ id: indexTermId, language, name })
              if (locations) {
                locations.forEach(([sectionId, anchorId]) => {
                  session.IndexTermLocation.upsert({
                    id: `${sectionId}#index-term-${anchorId}`,
                    anchorId,
                    indexTermId,
                    sectionId,
                  })
                })
              }
            })
          })
        }
        break
      }
      default:
        break
    }
  }
}
