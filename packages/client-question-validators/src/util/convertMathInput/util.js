import {
  BRACKET_PAIRS,
  DIFFERENTIALS,
  TO_REPLACE,
  TO_REPLACE_BRACKETS,
} from './constants'

// escape strings for use in regular expressions
export const regexEscape = (input) => {
  // return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  return input.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

// Construct character classes for opening and closing parentheses
export const CHAR_CLASS_OPEN = Object.keys(BRACKET_PAIRS).reduce(
  (acc, key) => `${acc}${regexEscape(key)}`,
  ''
)

export const CHAR_CLASS_CLOSE = Object.keys(BRACKET_PAIRS).reduce(
  (acc, key) => `${acc}${regexEscape(BRACKET_PAIRS[key])}`,
  ''
)

/*
 * Repeatedly replace all matches of 'regex' until no matches are found.
 * This is necessary if matches overlap.
 *
 * regex: RegExp object
 * WARNING: It's easy to run into an infinite loop when using this function
 * */
export function replaceAllMatches(input, regex, replaceString) {
  let output = input
  let lastInput
  do {
    lastInput = output
    output = output.replace(regex, replaceString)
  } while (lastInput !== output)
  return output
}

/*
 * Returns the key to a given value in an associative array.
 * This only works correclty if the the value is only used once.
 * */
const getObjKey = (obj, value) =>
  Object.keys(obj).find((key) => obj[key] === value)

/*
 * Replaces everything from 'start' to 'end' in 'input' by 'replace'.
 * This works like String.prototype.slice (excluding the character at 'end')
 * */
const replaceByPos = (input, start, end, replace) =>
  `${input.slice(0, start)}${replace}${input.slice(end)}`

/*
 * Replace every occurence of 'word' in 'input'
 *
 * A word is only then matched, if is preceded or followed by letters or '\'
 * */
function replaceWord(input, word, replacement) {
  let lastChar = ' '
  let output = input
  const letter = RegExp('[a-zA-Z\\\\]', '')
  for (let pos = 0; pos < output.length; pos += 1) {
    if (!letter.test(lastChar) && output[pos] === word[0]) {
      let searchPos
      for (
        searchPos = 0;
        searchPos < word.length && word[searchPos] === output[pos + searchPos];
        searchPos += 1
      ) {
        // not found
      }
      // found
      if (
        searchPos === word.length &&
        (output.length <= pos + searchPos ||
          !letter.test(output[pos + searchPos]))
      ) {
        output = replaceByPos(output, pos, pos + searchPos, replacement)
        pos += replacement.length
      }
    }

    lastChar = output[pos]
  }

  return output
}

/*
 * Replace expressions in input using the patterns defined in TO_REPLACE
 *
 * input: string to be processed
 * mode: which kind of replacement should be performed ("latex", "mathjs")
 * */
export function simpleReplace(input, mode) {
  let output = input
  // Iterate over replacement patterns
  TO_REPLACE.forEach((element) => {
    // Iterate over 'names' of this expression ("expr") (e.g. asin, arcsin for the arcus sine)
    element.expr.forEach((expr) => {
      let ersetzung = element.replace[mode]
      ersetzung = ersetzung.replace(RegExp('\\$0', 'g'), expr) // replace $0 by the matched expression
      if (element.word) {
        // replace only complete words? ("sin" would only match "sin" but not "arcsin" )
        output = replaceWord(output, expr, ersetzung)
      } else {
        output = output.replace(RegExp(regexEscape(expr), 'g'), ersetzung)
      }
    })
  })
  return output
}

/*
 * Search for the matching bracket to a given bracket.
 *
 * Returns the position of the bracket or -1 if not found.
 * */
function findBrackets(input, bracketPos) {
  // bracketOpen doesn't have to be an opening bracket, it can also be a closing one
  // in which case function would search from right to left
  const bracketOpen = input[bracketPos]
  let bracketClose = ''
  let delta // search direction ( -1: left, +1: right )
  // Determine search direction and set bracket pairs
  if (BRACKET_PAIRS[bracketOpen] !== undefined) {
    // 'bracketOpen' is opening bracket
    bracketClose = BRACKET_PAIRS[bracketOpen]
    delta = 1 // search right
  } else if (getObjKey(BRACKET_PAIRS, bracketOpen)) {
    // check if 'bracketOpen' is a closing bracket
    bracketClose = getObjKey(BRACKET_PAIRS, bracketOpen)
    delta = -1 // search left
  } else {
    return -1
  }

  // Now do the actual search
  let bracketClosePos
  let i = 1
  for (
    bracketClosePos = bracketPos + delta;
    i > 0 && bracketClosePos >= 0 && bracketClosePos < input.length;
    bracketClosePos += delta
  ) {
    if (input[bracketClosePos] === bracketClose) {
      i -= 1
    } else if (input[bracketClosePos] === bracketOpen) {
      i += 1
    }
  }
  bracketClosePos -= delta // Compensate for the last "+= delta" in the loop

  // Matching bracket found?
  if (i === 0) {
    return bracketClosePos
  }
  return -1
}

/*
 * Searches for a string but only matches on a given level of brackets.
 * ( "bracketLevel" 0 by default, "startPos" 0 by default).
 *
 * Returns the position of the match or -1 if no match is found.
 *
 * NOTICE: Treats all bracket's equally. It doesn't check if they actually match
 * (possible improvement: Make this distinction possible)
 * */
function findAtBracketLevel(
  input,
  searchString,
  bracketLevel = 0,
  startPos = 0
) {
  let output = input

  // abort if "searchString" is empty
  if (!searchString.length) {
    return -1
  }

  // replace all parentheses by round brackets:
  output = output.replace(RegExp(`[${CHAR_CLASS_OPEN}]`, 'g'), '(')
  output = output.replace(RegExp(`[${CHAR_CLASS_CLOSE}]`, 'g'), ')')

  let searchStr = searchString.replace(RegExp(`[${CHAR_CLASS_OPEN}]`, 'g'), '(')
  searchStr = searchStr.replace(RegExp(`[${CHAR_CLASS_CLOSE}]`, 'g'), ')')

  let currentLevel = 0
  let pos // position in the input

  // search for "searchStr"
  for (pos = startPos; pos < output.length; pos += 1) {
    if (currentLevel === bracketLevel && output[pos] === searchStr[0]) {
      let searchPos
      for (
        searchPos = 0;
        searchPos < searchStr.length &&
        searchStr[searchPos] === output[pos + searchPos];
        searchPos += 1
      ) {
        // not found
      }
      if (searchPos === searchStr.length) {
        return pos // found
      }
    }

    // count brackets
    if (output[pos] === '(') {
      currentLevel += 1
    } else if (output[pos] === ')') {
      currentLevel -= 1
    }
  }

  return -1
}

/*
 * Recursively replaces expressions with parentheses (like functions).
 * A word followed by parentheses that contain one or multiple comma
 * separated expressions.
 *
 * Example (including variable names):
 * 	gamma+log(alpha,beta)+epsilon
 *   ---------^----- ----^--------
 *    ^       |  ^    ^  |      ^
 *    | openIdx  |    |closeIdx |
 *    front      |    |         rest
 *   contentArr[0]    contentArr[1]
 *
 * The patterns in 'TO_REPLACE_BRACKETS' are used.
 *
 * Parameters:
 *  input: input string
 *  mode: which kind of replacement should be performed ("latex", "mathjs")
 * */
export function bracketReplace(input, mode, errorList) {
  const output = input
  // find an opening bracket
  let rex = RegExp(`[${CHAR_CLASS_OPEN}]`, '') // opening bracket
  let match = rex.exec(output)
  if (match !== null) {
    const bracketOpen = match[0]
    const openIdx = match.index // position of the opening bracket
    const closeIdx = findBrackets(output, openIdx) // closing bracket
    if (closeIdx < 0) {
      errorList.push('missingClosingBracket')
      return output
    }

    // Array of arguments contained by the brackets
    const contentArr = []

    // Split content of the brackets using comma
    let nextComma = findAtBracketLevel(output, ',', 0, openIdx + 1)
    for (
      let pos = openIdx + 1;
      pos > 0 && pos < closeIdx;
      pos = nextComma + 1
    ) {
      nextComma = findAtBracketLevel(output, ',', 0, pos)
      if (nextComma === -1 || nextComma > closeIdx) {
        nextComma = closeIdx
      }
      contentArr.push(
        bracketReplace(output.slice(pos, nextComma), mode, errorList)
      )
    }

    // Strings in front of and after the expression
    let front = output.slice(0, openIdx)
    const rest = output.slice(closeIdx + 1)

    // String to put the new content of the brackets into
    let content = ''

    // Iterate over replacements
    match = null
    let i
    for (i = 0; i < TO_REPLACE_BRACKETS.length && match === null; i += 1) {
      const exprObj = TO_REPLACE_BRACKETS[i]
      // skip if the type of parentheses isn't in the list
      if (
        typeof exprObj.brackets === 'undefined' ||
        exprObj.brackets.search(regexEscape(bracketOpen)) !== -1
      ) {
        // Iterate over the patterns
        for (let j = 0; j < exprObj.expr.length; j += 1) {
          const expr = exprObj.expr[j]
          // search for the expression at the end of 'front'
          rex = RegExp(`(^|[^a-zA-Z\\\\])(${regexEscape(expr)})$`, '')
          match = rex.exec(front)
          if (match !== null) {
            front = front.replace(rex, '$1') // remove expression from 'front'
            // is a replacement with the given number of commas defined?
            if (
              typeof exprObj.replace[mode][contentArr.length] !== 'undefined'
            ) {
              content = exprObj.replace[mode][contentArr.length]
            } else if (typeof exprObj.replace[mode][0] !== 'undefined') {
              // is there a replacement for an arbitrary number of parameters?
              const replaceObject = exprObj.replace[mode][0]

              // concatenate replacement string
              content = replaceObject.begin
              for (let k = 1; k < contentArr.length; k += 1) {
                content +=
                  replaceObject.argument.replace('$i', `$${k}`) +
                  replaceObject.divider
              }
              content +=
                replaceObject.argument.replace('$i', `$${contentArr.length}`) +
                replaceObject.end
            } else {
              errorList.push('incorrectBracketsOrNumberOfCommas')
              return output
            }

            // replace all '$' expressions in 'content'
            // replace "$0" with "expr"
            rex = RegExp('\\$0', 'g')
            content = content.replace(rex, expr)
            // replace remaining arguments ($1, $2, ... )
            for (let k = contentArr.length; k > 0; k -= 1) {
              // count down to e.g. replace $11 before $1
              rex = RegExp(`\\$${k}`, 'g')
              content = content.replace(rex, contentArr[k - 1])
            }

            break // matching expression has been found
          }
        }
      }
    }

    // if no match, create "content" by concatenating "contentArr" (otherwise stuff like '{\cdot}' wouldn't work
    if (i === TO_REPLACE_BRACKETS.length && match === null) {
      content = bracketOpen + contentArr.join(',') + BRACKET_PAIRS[bracketOpen]
    }

    return `${front}${content}${bracketReplace(rest, mode, errorList)}`
  }
  return output
}

/*
 * Enclose functions in brackets
 * */
export function encloseFunctions(input, bracket, errorList) {
  let output = input
  const rex = RegExp(`([^${CHAR_CLASS_OPEN}\\\\a-z]|^)([a-z]+)\\([^\\(]`, 'i')

  let lastInput
  do {
    lastInput = output
    let match
    let i = 0
    do {
      // skip constructs so that they still can be parsed
      match = rex.exec(output)
      if (i > 100) {
        // prevent infinite loop
        break
      }
      i += 1
    } while (match !== null && /.(sum\(|int\(|prod\()/.test(output))
    if (match === null) {
      break
    }

    const bracketOpenPos = match.index + match[1].length + match[2].length
    const bracketClosePos = findBrackets(output, bracketOpenPos)
    if (bracketClosePos === -1) {
      errorList.push('missingClosingBracket')
      break
    }
    const functionCall = output.slice(
      match.index + match[1].length,
      bracketClosePos + 1
    )
    output = replaceByPos(
      output,
      match.index + match[1].length,
      bracketClosePos + 1,
      bracket + functionCall + BRACKET_PAIRS[bracket]
    )
  } while (output !== lastInput)

  return output
}

/*
 * Process differentials to be of the form '(d(x))'
 * (both LaTeX and mathjs strings)
 *  input: input string
 *  bracketType: opening bracket of the type to be used in the replacement
 *              ( mainly '(' for the mathjs string and '{' for the LaTeX string )
 *
 * Differentials of the form 'd(...)' are processed via 'TO_REPLACE_BRACKETS'
 * */
export function preprocessDifferentials(input, bracketType) {
  const bracketOpen = bracketType
  const bracketClose = BRACKET_PAIRS[bracketType]
  // create regex for simple differentials (dx, dy, ...)
  const regexString = `(${DIFFERENTIALS.join('|')})`

  const rex = RegExp(`(^|[^a-zA-Z])d${regexString}($|[^a-zA-Z])`, 'g')
  return replaceAllMatches(
    input,
    rex,
    `$1${bracketOpen}d${bracketOpen}$2${bracketClose}${bracketClose} $3`
  )
}

/*
 * Encloses constructs in the LaTeX string with curly braces to make
 * subsequent parsing easier
 * */
export function encloseLatexConstructs(input, errorList) {
  let output = input

  // regex for finding the beginning of constructs that aren't in curly braces yet
  const rex = RegExp(
    `(^|[^${CHAR_CLASS_OPEN}]\\s*)\\\\(int|prod|sum)\\s*(\\^|_)`,
    ''
  )

  // process all constructs
  let match = rex.exec(output)
  while (match !== null) {
    const typ = match[2] // extract type from the second regex submatch (int, prod or sum)
    const startPos = match.index + match[1].length // position of the '\' in front of typ

    // search end of the construct
    let endPos = startPos
    if (typ === 'int') {
      // integral?
      // search for the differential
      const rest = output.slice(startPos)
      endPos = findAtBracketLevel(rest, '{d{', 0)
      if (endPos < 0) {
        errorList.push('missingDifferential')
        return output
      }

      endPos = findBrackets(rest, endPos) + 1
      if (endPos < 1) {
        // 0 + 1 = 1
        errorList.push('incorrectBrackets')
        return output
      }

      endPos += startPos
    } else {
      // search for the end of the third curly brace, comma or end of the string
      // "...\prod_{..}^{..}{...}..." or "...\prod_{..}^{..}....."
      //                        ^                                 ^

      // go to end of the lower bound
      let pos = findAtBracketLevel(output, '{', 0, startPos)
      pos = findBrackets(output, pos)
      // go to end of the upper bound ( beginning of content )
      pos = (output, '{', 0, pos + 1)
      pos = findBrackets(output, pos)
      if (pos < 0) {
        errorList.push('incorrectBrackets')
      }

      if (
        pos + 1 < output.length &&
        RegExp(`[${CHAR_CLASS_OPEN}]`, 'g').test(output[pos + 1])
      ) {
        endPos = findBrackets(output, pos + 1)
      } else {
        endPos = (output, ',', 0, pos + 1)
        if (endPos < 0) {
          endPos = output.length - 1
        }
      }
    }

    const construct = output.slice(startPos, endPos + 1) // entire construct

    // enclose construct in curly braces
    output = replaceByPos(output, startPos, endPos + 1, `{${construct}}`)
    match = rex.exec(output)
  }
  return output
}

/*
 * Search for exponentiation in the LaTeX string and enclose them with curly
 * braces to make it easier to display fractions later.
 *
 * The important part is the distinction between '^' as exponentiation operator
 * and '^' as beginning of an upper bound
 * */
export function encloseLatexPower(input, errorList) {
  let output = input

  // possible improvement: less copy and paste
  // replace any number of whitespaces by only one whitespace (e.g "  " -> " ")
  output = output.replace(/\s+/g, ' ')

  // process all " ^" in the input
  // IMPORTANT: All " ^" have to be replaced by "^" otherwise this is an infinite loop
  for (
    let caretPos = output.lastIndexOf(' ^');
    caretPos !== -1;
    caretPos = output.lastIndexOf(' ^')
  ) {
    // go through all " ^" from end to start
    const start = output.slice(0, caretPos)
    const end = output.slice(caretPos + 2) // " ^".length === 2

    // examine lefthand side
    let regexp = RegExp('(\\\\?[a-z]+|[0-9]+(\\.[0-9]+)?)!*$', 'i') // number or variable (including '!' in case of factorial)
    let regexBracket = RegExp(`[${CHAR_CLASS_CLOSE}](!*)$`, '') // closing bracket the the end (including '!' in case of factorial)
    const valuePos = start.search(regexp)
    let bracketPos = start.search(regexBracket)
    let baseStart // position of the beginning of the base of the exponentiation
    if (valuePos !== -1) {
      // simple expression in front of " ^"
      if (valuePos > 0 && start[valuePos - 1] === '_') {
        // lower bound in front ( ==> no exponentiation )
        output = `${start}^${end}`
        break
      }
      baseStart = valuePos
    } else if (bracketPos !== -1) {
      // bracket expression in front of " ^"
      const match = regexBracket.exec(start)
      bracketPos = match.index
      bracketPos = findBrackets(start, bracketPos) // jump to opening bracket
      if (bracketPos < 0) {
        errorList.push('missingOpeningBracket')
        return output
      }

      // go on left up to the beginning of a function if there is any
      // ...5+\arcsin(.....)
      //      ^<----^
      for (
        bracketPos -= 1;
        bracketPos >= 0 && /[a-z\\]/i.test(start[bracketPos]);
        bracketPos -= 1
      ) {
        // not found
      }
      if (bracketPos >= 0 && start[bracketPos] === '_') {
        // lower bound in front ( ==> no exponentiation )
        output = `${start}^${end}`
        break
      }
      bracketPos += 1 // compensate last '--' of the loop

      baseStart = bracketPos
    } else {
      errorList.push('invalidBaseInExponentation')
      return output
    }

    // process righthand side
    regexp = RegExp('^(\\\\?[a-z]+|[0-9]+(\\.[0-9]+)?)', 'i') // number or variable (without factorial)
    regexBracket = RegExp(`^(\\\\?[a-z]+)?([${CHAR_CLASS_OPEN}])`, 'i') // opening bracket or function
    let exponentEnd
    if (regexBracket.test(end)) {
      // bracket expression or function in the exponent
      exponentEnd = end.search(RegExp(`[${CHAR_CLASS_OPEN}]`), '')
      exponentEnd = findBrackets(end, exponentEnd)
      if (exponentEnd < 0) {
        errorList.push('missingClosingBracket')
        return output
      }

      if (end.length > exponentEnd + 2 && end[exponentEnd + 2] === '_') {
        // lower bound following ( ==> no exponentiation )
        output = `${start}^${end}`
        break
      }
    } else if (regexp.test(end)) {
      // number or variable at the beginning
      const match = regexp.exec(end)
      exponentEnd = match[0].length
      if (end.length > exponentEnd + 2 && end[exponentEnd + 2] === '_') {
        // lower bound following ( ==> no exponentiation )
        output = `${start}^${end}`
        break
      }
    } else {
      errorList.push('incorrectExponent')
      return output
    }

    // at this point it's clear that it really is an exponentiation
    // and not the bounds of a construct
    // ==> enclose entire expression in brackets

    // split output further
    const base = start.slice(baseStart)
    const front = start.slice(0, baseStart)
    const exponent = end.slice(0, exponentEnd)
    const rest = end.slice(exponentEnd)

    // put together
    output = `${front}{${base}^${exponent}}${rest}`
  }

  return output
}

/*
 * Transform fractions in the input into LaTeX fractions
 * of the form "\frac{..}{..}"
 * */
export function latexFractions(input, errorList) {
  let output = input
  // process all '/' in the input
  for (
    let slashPos = output.search('/');
    slashPos !== -1;
    slashPos = output.search('/')
  ) {
    let start = output.slice(0, slashPos)
    let end = output.slice(slashPos + 1)

    // process lefthand side

    // number or variable ( including "!" in case of factorial )
    let regexp = RegExp('(\\\\?[a-z]+|[0-9]+(\\.[0-9]+)?)!*$', 'i')
    // closing bracket at the end ( including "!" in case of factorial )
    let regexBracket = RegExp(`[${CHAR_CLASS_CLOSE}](!*)$`, '')

    if (regexp.test(start)) {
      // number or variable at the end of the string
      start = start.replace(regexp, '{\\frac{$&}')
    } else if (regexBracket.test(start)) {
      // bracket expression in the numerator
      const match = regexBracket.exec(start)
      const bracketClosePos = match.index
      let pos = findBrackets(start, bracketClosePos)
      if (pos < 0) {
        errorList.push('missingOpeningBracket')
        return output
      }

      // continue going left up to the beginning of a function in front (if there is any)
      // ...5+\arcsin(.....)
      //      ^<----^
      for (pos -= 1; pos >= 0 && /[a-z\\]/i.test(start[pos]); pos -= 1) {
        // not found
      }
      pos += 1 // compensate last '--' of the loop

      const numerator = start.slice(pos)
      start = replaceByPos(start, pos, start.length, `{\\frac{${numerator}}`)
    } else {
      errorList.push('incorrectDividend')
      return output
    }

    // process right hand side
    regexp = RegExp('^(\\\\?[a-z]+|[0-9]+(\\.[0-9]+)?)!*', 'i') // number or variable ( including "!" in case of factorial )
    regexBracket = RegExp(`^(\\\\?[a-z]+)?([${CHAR_CLASS_OPEN}])`, 'i') // opening bracket or function at the beginning
    if (regexBracket.test(end)) {
      // bracket expression or function in the denominator
      let pos = end.search(RegExp(`[${CHAR_CLASS_OPEN}]`, ''))
      pos = findBrackets(end, pos)
      if (pos < 0) {
        errorList.push('missingClosingBracket')
        return output
      }

      // take following '!' into account
      for (; end.length > pos + 1 && end[pos + 1] === '!'; pos += 1) {
        // not found
      }

      const denominator = end.slice(0, pos + 1)
      end = replaceByPos(end, 0, pos + 1, `{${denominator}}}`)
    } else if (regexp.test(end)) {
      // number or variable at the beginning of the string
      end = end.replace(regexp, '{$&}}')
    } else {
      errorList.push('incorrectDivisor')
      return output
    }

    output = `${start}${end}`
  }

  return output
}

/*
 * swaps '^(...) _(...)' --> '_(...)^(...)'
 *
 * This only works in the mathjs string, not the latex string
 *
 * NOTICE: bounds inside of bounds aren't supported
 * ( like "int_{int_{a}^{b}}^{c}" )
 *                 --------
 * */
export function swapBoundaries(input, errorList) {
  let output = input

  // remove whitespaces
  output = output.replace(/\s+/g, '')

  const lowerBoundStart = findAtBracketLevel(output, '_(', 0) // "start"->_(...)
  if (lowerBoundStart !== -1) {
    // Wenn "_(" gefunden
    const lowerBoundEnd = findBrackets(output, lowerBoundStart + 1) // _(...)<-"end"
    if (lowerBoundEnd < 0) {
      errorList.push('incorrectLowerBound')
      return output
    }

    // strings in front of and after '_(...)'
    const start = output.slice(0, lowerBoundStart)
    const end = output.slice(lowerBoundEnd + 1)

    const lowerBound = output.slice(lowerBoundStart + 2, lowerBoundEnd)

    // the position of the upper bound isn't relative to 'output', but 'start'
    // or 'end', depending on where the upper bound is
    let upperBoundStart
    let upperBoundEnd

    // search for '^(..)' after '_(..)'
    upperBoundStart = findAtBracketLevel(end, '^(', 0)
    if (upperBoundStart === 0) {
      // "^(" at the beginning of  'end'
      upperBoundEnd = findBrackets(end, 1)
      if (upperBoundEnd >= 0) {
        const upperBound = end.slice(upperBoundStart + 2, upperBoundEnd)
        const restEnd = end.slice(upperBoundEnd + 1) // remaining part of 'end' that doesn't belong to the upper bound
        // return the string without swapping
        return (
          `${start}_(${lowerBound})` +
          `^(${upperBound})${swapBoundaries(restEnd, errorList)}`
        )
      }
      errorList.push('incorrectUpperBound')
      return output
    }
    // search for '^(...)' in front of '_(...)'
    if (start[start.length - 1] === ')') {
      // does 'start' end with ')'?
      upperBoundEnd = start.length - 1
      upperBoundStart = findBrackets(start, upperBoundEnd) - 1
      if (upperBoundStart >= 0 && start[upperBoundStart] === '^') {
        const upperBound = start.slice(upperBoundStart + 2, upperBoundEnd)
        const startFront = start.slice(0, upperBoundStart)
        return (
          `${startFront}_(${swapBoundaries(lowerBound, errorList)})` +
          `^(${swapBoundaries(upperBound, errorList)})${swapBoundaries(
            end,
            errorList
          )}`
        )
      }
      errorList.push('missingUpperBound')
      return output
    }
    errorList.push('missingUpperBound')
    return output
  }

  return output // this line should never be reached
}

/*
 * Determines the content of a construct and it's differential (for integrals) and formats it:
 *
 *
 *   mathjs-string: int_(...)^(...)(...)(d(x))
 *                                ^   ^
 *                          'start' 'end'
 *
 * Returns an object with the element 'mathjs'
 * */
export function replaceConstructs(input, integrationSteps, errorList) {
  const result = {
    mathjs: input,
  }
  let regex = new RegExp('(int|sum|prod)_\\(')
  const match = regex.exec(input)
  if (match !== null) {
    const typ = match[1] // type ( sum, int, prod )

    // bounds and content
    const lowerStart = match.index + typ.length + 1 // "int_" = typ.length + 1
    const upperStart = findBrackets(input, lowerStart) + 2 // ")^" = 2
    if (upperStart < 2) {
      // 0 (length of findBrackets) + 2 = 2
      errorList.push('missingClosingBracket')
      return input
    }
    let lower = input.slice(lowerStart + 1, upperStart - 2) // lower bound
    const contentStart = findBrackets(input, upperStart) + 1 // ")" = 1
    if (contentStart < 1) {
      // 0 + 1 = 1
      errorList.push('missingClosingBracket')
      return input
    }
    const upper = input.slice(upperStart + 1, contentStart - 1) // upper bound
    let contentEnd = contentStart // isn't determined yet

    const front = input.slice(0, match.index) // everything in front of the construct
    let variable = '' // control variable, differential for integrals ( without "(d(" and ")" )
    let rest = '' // remaining part of the input string (after 'inhalt', including the differential (for integrals)

    if (typ === 'int') {
      // integral

      // position of the brackets around the differential
      const diffOpen = findAtBracketLevel(input, '(d(', 0, contentStart) // beginning of the differential

      contentEnd = diffOpen - 1

      if (diffOpen >= input.length || diffOpen < 0) {
        errorList.push('missingDifferential')
        return input
      }

      // first closing bracket of the differential "(d(...)<---"
      const diffClose = findBrackets(input, diffOpen + 2)
      if (diffClose < 0) {
        errorList.push('missingDifferentialClosingBracket')
        return input
      }

      // get the variable ( of the differential )
      variable = input.slice(diffOpen + 3, diffClose)

      rest = input.slice(diffClose + 2)
    } else {
      // no integral
      // get the control variable by splitting the lower bound
      const lowerSplit = lower.split('=')
      variable = lowerSplit.shift() // remove first element of 'lowerSplit' and store it inside 'variable'
      lower = lowerSplit.join('=') // put the remaining part of 'lowerSplit' back together (important for nested constructs)

      // get content
      if (input[contentStart] === '(') {
        // content enclosed in parenthesest?
        contentEnd = findBrackets(input, contentStart)
      } else {
        // else content up to either "," (in vectors) or the end of the string
        contentEnd = findAtBracketLevel(input, ',', 0, contentStart)
        if (contentEnd < 0) {
          // no comma found -> end of string
          contentEnd = input.length - 1
        }
      }

      if (contentEnd < 0) {
        // error handling
        errorList.push('incorrectBrackets')
        return input
      }
      rest = input.slice(contentEnd + 1)
    }

    let content = input.slice(contentStart, contentEnd + 1)

    // replace the variable by a keyword
    // ( "(supportvar_$variable)" ( replace $variable by the actual name of the variable )
    const variableEscaped = regexEscape(variable) // escape special characters (for proper regex syntax)
    if (variableEscaped.length <= 0) {
      // check for empty variable to prevent infinite loop
      errorList.push('emptyVariable')
      return input
    }
    regex = RegExp(`(^|[^a-zA-Z_])${variableEscaped}($|[^a-zA-Z])`, '')
    content = replaceAllMatches(
      content,
      regex,
      `$1(supportvar_${variableEscaped})$2`
    )

    // recursive call to process nested constructs
    const lowerObj = replaceConstructs(lower, integrationSteps, errorList)
    const upperObj = replaceConstructs(upper, integrationSteps, errorList)
    const contentObj = replaceConstructs(content, integrationSteps, errorList)
    const restObj = replaceConstructs(rest, integrationSteps, errorList)

    // create result object
    result.mathjs = `${front}konstrukt(${typ},${variable},${lowerObj.mathjs},${
      upperObj.mathjs
    },${contentObj.mathjs}${typ === 'int' ? `,${integrationSteps}` : ''})${
      restObj.mathjs
    }`
  }

  return result
}

/*
 * Check a string for missing closing brackets.
 *
 * returns true or false
 * */
export function checkBrackets(input) {
  const stack = []
  let abs = 0

  for (let i = 0; i < input.length; i += 1) {
    if (input[i] === '|') {
      // skip absolute value function
      abs += 1
    }
    // closing bracket?
    else if (getObjKey(BRACKET_PAIRS, input[i]) !== undefined) {
      // does the closing bracket fit the opening bracket on top of the stack?
      if (stack.pop() !== getObjKey(BRACKET_PAIRS, input[i])) {
        return false
      }
    } else if (Object.hasOwnProperty.call(BRACKET_PAIRS, input[i])) {
      // opening bracket
      stack.push(input[i])
    }
  }

  return stack.length === 0 && abs % 2 === 0
}
