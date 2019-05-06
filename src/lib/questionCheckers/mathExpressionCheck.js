import nerdamer from 'nerdamer'

// const DEFAULT_PRECISION = 4

const check = (input, solution, attributes) => {
  // const precision = attributes.precision ||
  try {
    return nerdamer(input).eq(solution)
  } catch {
    return false
  }
  // const epsilon = math.eval(`1e-${precision || DEFAULT_PRECISION}`)
  // math.config({ epsilon })
  // try {
  //   const evalInput = math.eval(input)
  //   const evalSolution = math.eval(solution)
  //   if (evalInput) {
  //     return math.equal(evalInput, evalSolution)
  //   }
  // } catch (e) {
  //   if (e instanceof SyntaxError) {
  //     return false
  //   }
  // }
  // return false
}

export default check
