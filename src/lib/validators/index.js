import StringEqualityValidator from './StringEqualityValidator'
import MathExpressionEqualityValidator from './MathExpressionEqualityValidator'
import MathFormulaValidator from './MathFormulaValidator'

export default {
  exact: StringEqualityValidator,
  mathExpression: MathExpressionEqualityValidator,
  mathFormula: MathFormulaValidator,
}
