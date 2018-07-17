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
}

export default defaultInitialState
