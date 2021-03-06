// TODO: do we need to support multiple solutions? (like "foo,bar")
// this is specified in mintmod, check tub_math it is actually used

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

const equality = (input, solution) => {
  let ok
  const messages = []

  if (input === '') {
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
    ok = RESULT_VALUE.NEUTRAL
  } else if (input === solution) {
    ok = RESULT_VALUE.CORRECT
    messages.push({ msg: 'correct-answer', type: 'success' })
  } else {
    ok = RESULT_VALUE.INCORRECT
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
  }

  return [ok, messages]
}

export default equality
