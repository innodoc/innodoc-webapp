import equalityCheck from './equalityCheck'
import mathExpressionCheck from './mathExpressionCheck'
import mathFunctionCheck from './mathFunctionCheck'
import mathSimplifyCheck from './mathSimplifyCheck'

export default {
  boolean: equalityCheck,
  exact: equalityCheck,
  mathExpression: mathExpressionCheck,
  mathFunction: mathFunctionCheck,
  mathSimplify: mathSimplifyCheck,
}
