import math from 'mathjs'

const DEFAULT_PRECISION = 4

// TODO: is this mathematically correct (or exact same as mintmod?)
const check = (input, solution, { precision }) => {
  const epsilon = math.eval(`1e-${precision || DEFAULT_PRECISION}`)
  math.config({ epsilon })
  try {
    const evalInput = math.eval(input)
    const evalSolution = math.eval(solution)
    if (evalInput) {
      return math.equal(evalInput, evalSolution)
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      return false
    }
  }
  return false
}

export default check
