const defaultInitialState = {
  ui: {
    sidebarVisible: false,
    message: null,
  },
  content: {
    contentRoot: '',
    currentSectionPath: null,
    toc: [],
    sections: {},
    title: {},
  },
  exercises: {},
  i18n: {
    language: null,
  },
}

// empty content (resides in state.content.data[lang])
const defaultContentData = {
  sections: {},
  toc: [],
}

export { defaultContentData }
export default defaultInitialState
