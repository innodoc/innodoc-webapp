/* eslint-disable @typescript-eslint/no-restricted-imports */

// TODO move to store/hooks

import {
  type TypedUseSelectorHook,
  useDispatch as useDispatchReactRedux,
  useSelector as useSelectorReactRedux,
} from 'react-redux'

import type { RootState, AppDispatch } from '#store/makeStore'

export const useDispatch: () => AppDispatch = useDispatchReactRedux
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorReactRedux
