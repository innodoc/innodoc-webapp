import equalityCheck from './equalityCheck'
import mathExpressionCheck from './mathExpressionCheck'
import mathFunctionCheck from './mathFunctionCheck'

export default {
  boolean: equalityCheck,
  exact: equalityCheck,
  mathExpression: mathExpressionCheck,
  mathFunction: mathFunctionCheck,
}
