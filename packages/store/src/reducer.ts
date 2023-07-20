import appSlice from './slices/app/appSlice'
import contentApi from './slices/content/contentApi'
import hastSlice from './slices/hast/hastSlice'

const reducer = {
  [contentApi.reducerPath]: contentApi.reducer,
  [appSlice.name]: appSlice.reducer,
  [hastSlice.name]: hastSlice.reducer,
}

export default reducer
