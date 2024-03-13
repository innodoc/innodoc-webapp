import type { Data as UnistData } from 'unist'

declare module 'unist' {
  interface Data extends UnistData {
    /** Ordinal number for certain cards */
    ordinal?: number
  }
}
