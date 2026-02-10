import type { configureStore, ListenerEffectAPI, TypedStartListening } from '@reduxjs/toolkit'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import type makeStore from './makeStore.js'
import type { rootReducer } from './makeStore.js'

/** Store type */
type Store = ReturnType<typeof makeStore>

/** Root state */
type RootState = ReturnType<typeof rootReducer>

/** Dispatch type */
type AppDispatch = Store['dispatch']

/** BaseQuery type */
type BaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>

/** Middleware listener startListening type */
type AppStartListening = TypedStartListening<RootState, AppDispatch>

/** Middleware listener effect API */
type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>

// Infer type of RTK's `getDefaultMiddleware`
type MiddlewareOption = NonNullable<Parameters<typeof configureStore<RootState>>[0]['middleware']>
type GetDefaultMiddleware = Parameters<MiddlewareOption>[0]

export type { AppDispatch, AppListenerEffectAPI, AppStartListening, BaseQuery, GetDefaultMiddleware, RootState, Store }
