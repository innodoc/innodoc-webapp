import orm from './orm'

const defaultInitialState = {
  ui: {
    sidebarVisible: false,
    message: null,
  },
  content: {
    contentRoot: '',
    currentSectionPath: null,
    data: {},
  },
  exercises: {},
  i18n: {
    language: null,
  },
  db: orm.getDefaultState(),
}

// empty content (resides in state.content.data[lang])
const defaultContentData = {
  sections: {},
  toc: [],
}

export { defaultContentData }
export default defaultInitialState
