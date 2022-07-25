// TODO: do we need to support multiple solutions? (like "foo,bar")
// this is specified in mintmod, check tub_math it is actually used

import constants from '@innodoc/misc/constants'

const equality = (input, solution) => {
  let ok
  const messages = []

  if (input === '') {
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
    ok = constants.RESULT.NEUTRAL
  } else if (input === solution) {
    ok = constants.RESULT.CORRECT
    messages.push({ msg: 'correct-answer', type: 'success' })
  } else {
    ok = constants.RESULT.INCORRECT
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
  }

  return [ok, messages]
}

export default equality
