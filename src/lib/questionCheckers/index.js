import mathExpressionCheck from './mathExpressionCheck'
import mathFunctionCheck from './mathFunctionCheck'

const equalityCheck = (input, solution) => input === solution

export default {
  boolean: equalityCheck,
  exact: equalityCheck,
  mathExpression: mathExpressionCheck,
  mathFunction: mathFunctionCheck,
}
