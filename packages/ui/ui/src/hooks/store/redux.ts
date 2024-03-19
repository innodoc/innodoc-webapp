// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch as useDispatchReactRedux, useSelector as useSelectorReactRedux } from 'react-redux'

import type { AppDispatch, RootState } from '@innodoc/store/types'

const useDispatch = useDispatchReactRedux.withTypes<AppDispatch>()
const useSelector = useSelectorReactRedux.withTypes<RootState>()

export { useDispatch, useSelector }
