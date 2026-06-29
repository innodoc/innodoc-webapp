import type rootReducer from './reducer.js'
import type {
  EnhancedStore,
  ListenerEffectAPI,
  ThunkDispatch,
  TypedStartListening,
  UnknownAction,
} from '@reduxjs/toolkit'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

/** Root state */
type RootState = ReturnType<typeof rootReducer>

/** App dispatch */
type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>

/** Store (used for both client and SSR) */
type Store = Omit<EnhancedStore<RootState, UnknownAction>, 'dispatch'> & {
  dispatch: AppDispatch
}

/** BaseQuery type */
type BaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>

/** Middleware listener startListening type */
type AppStartListening = TypedStartListening<RootState, AppDispatch>

/** Middleware listener effect API */
type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>

export type { AppDispatch, AppListenerEffectAPI, AppStartListening, BaseQuery, RootState, Store }
