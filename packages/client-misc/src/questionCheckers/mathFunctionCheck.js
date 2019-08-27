import nerdamer from 'nerdamer'

const check = (input, solution) => {
  try {
    return nerdamer(input).eq(solution)
  } catch {
    return false
  }
  // try {
  //   const parsedInput = math.simplify(math.parse(input))
  //   const parsedSolution = math.simplify(math.parse(solution))
  //   if (parsedInput) {
  //     return parsedInput.equals(parsedSolution)
  //   }
  // } catch (e) {
  //   if (e instanceof SyntaxError) {
  //     return false
  //   }
  // }
}

export default check
