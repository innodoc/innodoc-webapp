const makeActions = (actionList = []) =>
  actionList.reduce((acc, action) => ({ ...acc, [action]: action }), {})

export default makeActions
