import nerdamer from 'nerdamer'

// const DEFAULT_PRECISION = 4

const check = (input, solution) => {
  try {
    return nerdamer(input).eq(solution)
  } catch {
    return false
  }
}

export default check
