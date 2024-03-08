import type {
  configureStore,
  ListenerEffectAPI,
  StateFromReducersMapObject,
  TypedStartListening,
} from '@reduxjs/toolkit'

import type makeStore from './makeStore'
import type reducer from './reducer'

/** Store type */
type Store = ReturnType<typeof makeStore>

/** Root state */
type RootState = StateFromReducersMapObject<typeof reducer>

/** Dispatch type */
type AppDispatch = Store['dispatch']

/** Middleware listener startListening type */
type AppStartListening = TypedStartListening<RootState, AppDispatch>

/** Middleware listener effect API */
type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>

// Infer type of RTK's `getDefaultMiddleware`
type MiddlewareOption = NonNullable<Parameters<typeof configureStore<RootState>>[0]['middleware']>
type GetDefaultMiddleware = Parameters<MiddlewareOption>[0]

export type { AppDispatch, AppListenerEffectAPI, AppStartListening, GetDefaultMiddleware, RootState, Store }
