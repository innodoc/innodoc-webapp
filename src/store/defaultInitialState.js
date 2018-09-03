const defaultInitialState = {
  ui: {
    sidebarVisible: false,
    message: null,
  },
  content: {
    contentRoot: '',
    currentSectionId: null,
    data: {},
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
