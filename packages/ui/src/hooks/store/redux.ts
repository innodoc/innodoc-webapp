/* eslint-disable @typescript-eslint/no-restricted-imports */
import {
  type TypedUseSelectorHook,
  useDispatch as useDispatchReactRedux,
  useSelector as useSelectorReactRedux,
} from 'react-redux'

import type { AppDispatch, RootState } from '@innodoc/store/types'

const useDispatch: () => AppDispatch = useDispatchReactRedux
const useSelector: TypedUseSelectorHook<RootState> = useSelectorReactRedux

export { useDispatch, useSelector }
