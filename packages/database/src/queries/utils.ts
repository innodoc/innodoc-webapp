import type { IdResult, ValueResult } from './types'

/**
 * Unpack database value.
 *
 * @param result Database result to unpack
 * @returns Unpacked value
 */
function unpackValue<T>(result: ValueResult<T> | undefined): T | undefined {
  return result ? result.value : undefined
}

/**
 * Unpack database ID.
 *
 * @param result Database result to unpack
 * @returns Unpacked ID
 */
function unpackId(result: IdResult | undefined): number | undefined {
  return result ? result.id : undefined
}

export { unpackId, unpackValue }
