import { Model, attr, fk } from 'redux-orm'

export default class IndexTermLocation extends Model {
  static get modelName() {
    return 'IndexTermLocation'
  }

  static get fields() {
    return {
      id: attr(),
      anchorId: attr(),
      indexTermId: fk('IndexTerm', 'locations'),
      language: attr(),
      sectionId: fk('Section', 'indexTermLocations'),
    }
  }

  getContentId() {
    return `${this.sectionId.id}#index-term-${this.anchorId}`
  }
}
