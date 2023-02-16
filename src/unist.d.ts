import type { Data as UnistData } from 'unist'

declare module 'unist' {
  export interface Data extends UnistData {
    /** Unique ID */
    id?: string

    /** Ordinal number for certain cards */
    ordinal?: number
  }
}
