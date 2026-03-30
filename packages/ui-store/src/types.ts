import type { ListenerEffectAPI, TypedStartListening } from '@reduxjs/toolkit'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import type makeStore from './make-store.js'
import type { rootReducer } from './make-store.js'

/** Store type */
type Store = Awaited<ReturnType<typeof makeStore>>

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

export type { AppDispatch, AppListenerEffectAPI, AppStartListening, BaseQuery, RootState, Store }
