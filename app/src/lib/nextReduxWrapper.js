import { createWrapper } from 'next-redux-wrapper'

import makeStore from '@innodoc/store/makeStore'

export default createWrapper(makeStore, {
  debug: process.env.NEXT_PUBLIC_NEXT_REDUX_WRAPPER_DEBUG === 'true',
})
