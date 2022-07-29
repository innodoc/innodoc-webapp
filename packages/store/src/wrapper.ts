import { createWrapper } from 'next-redux-wrapper'

import makeStore, { AppStore } from './makeStore'

export default createWrapper<AppStore>(makeStore)
