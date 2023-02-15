import type { Data as UnistData } from 'unist'

declare module 'unist' {
  export interface Data extends UnistData {
    /** Unique ID */
    uuid?: string

    /** Ordinal number for certain cards */
    ordinal?: number
  }
}
