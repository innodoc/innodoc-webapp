const defaultInitialState = {
  ui: {
    sidebarVisible: false,
    message: null,
  },
  content: {
    loading: false,
    currentSectionId: null,
    sections: {},
    toc: [],
  },
  exercises: {},
  i18n: {
    language: null,
  },
}

export default defaultInitialState
