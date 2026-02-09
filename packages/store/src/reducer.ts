import appSlice from './slices/app/appSlice.js'
import contentApi from './slices/content/contentApi.js'
import hastSlice from './slices/hast/hastSlice.js'

const reducer = {
  [contentApi.reducerPath]: contentApi.reducer,
  [appSlice.name]: appSlice.reducer,
  [hastSlice.name]: hastSlice.reducer,
}

export default reducer
