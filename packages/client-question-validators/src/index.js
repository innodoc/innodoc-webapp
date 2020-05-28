import equality from './equality'
import exactFraction from './exactFraction'
import func from './function'
import interval from './interval'
import parsed from './parsed'

export default {
  boolean: equality,
  exact: equality,
  'exact-fraction': exactFraction,
  function: func,
  interval,
  parsed,
}
