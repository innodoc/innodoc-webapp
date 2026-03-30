import type { InitialState } from './types.js'

declare global {
  interface Window {
    __initial_state__: InitialState
  }

  var __initial_state__: Window['__initial_state__']
}
