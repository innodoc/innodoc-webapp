import type { ListenerEffectAPI, TypedStartListening } from '@reduxjs/toolkit'

import type { AppDispatch, RootState } from '#store/makeStore'

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>
