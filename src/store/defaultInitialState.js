const defaultInitialState = {
  ui: {
    sidebarVisible: false,
    message: null,
    language: null,
  },
  content: {
    loading: false,
    currentSectionId: null,
    sections: {},
    toc: null,
  },
  exercises: {},
}

export default defaultInitialState
